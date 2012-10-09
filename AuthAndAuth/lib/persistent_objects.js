module.exports = function(resource) {
  var util = require('util');

  var _db = resource.db, _table = resource.table;
  
  var _camelCase = function(s) {
    return s.replace(/([a-z])_([a-z])/g, function(ss, c1, c2) { return c1 + c2.toUpperCase(); });
  };
  
  var _underLine = function(s) {
    return s.replace(/([a-z])([A-Z])/g, function(ss, c1, c2) { return c1 + '_' + c2.toLowerCase(); });
  };
  
  var _recreate = function(hash) {
		var r = new resource;
		for (var k in hash)
				r['_' + _camelCase(k)] = hash[k];
		r._isNew = false;
    return r;
  }
  
  return {
    findOne: function(fields, condition, values, callback) {
      var whereClause = condition? ' where ' + condition: '';
      var query = 'select ' + fields + ' from ' + _table + whereClause;
      _db.fetchRow(query, values,
                    function(err, res) {
                      var theResource =  !err && res? _recreate(res): res;
                      callback(err, theResource);
                    });
    },
    
    findMany: function(fields, condition, values, callback) {
      var whereClause = condition? ' where ' + condition: '';
      var query = 'select ' + fields + ' from ' + _table + whereClause;
      _db.fetchAll(query, values,
                    function(err, theResources) {
                      callback(err, theResources.map(function(r, i, o) { return _recreate(r); }));
                    });
    },
    
    findOneObject: function(condition, values, callback) {
      this.findOne('*', condition, values, callback);
    },
    
    findManyObjects: function(condition, values, callback) {
      this.findMany('*', condition, values, callback);
    },
    
    findAnyObjects: function(callback) {
      this.findMany('*', '', [], callback);
    },
    
    destroy: function(key) {
      return function(value, callback) {
        _db.remove(_table, [[key + ' = ?', value]], callback);
      }
    },
    
    count: function(callback) {
      _db.fetchOne('select count(*) from ' + _table, [], callback);
    },
    
    save: function(validation, message, afterSaveMethod) {
      return function(callback) {
        var self = this;
        var valid = validation? validation(self): true;
        if (valid) {
          var h = new Object;
          resource.persistentProperties.forEach(function(p, i, pp) {
            h[_underLine(p.replace('_', ''))] = self[p]||'';
          });
          var now = new Date();
          h.updated_at = now;
      		try {      
      			if (self._isNew) {
              h.created_at = now;
      				_db.insert(_table, h, function(err) { self._isNew = false;
        																						self._id = _db.getLastInsertId();
                                                    if (afterSaveMethod)
                                                      self[afterSaveMethod](err, callback);
                                                    else
          																						callback(err);});
            }
      			else
        			_db.update(_table, h, [['id = ?', self._id]], callback);
      		} catch(e) { callback(e); }
        }
        else
          callback(Error(message));
      }
    }
  }
}
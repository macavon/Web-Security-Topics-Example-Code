module.exports = function(db) {
	require('./../lib/extensions');
	
  var Role = function(options) {
    if (options) {
      this._name = options.name;
      this._level = options.level;
			this._isNew = true;
    }
  };
  
  Role.persistentProperties = ['_name', '_level'];
  
  Object.defineProperty(Role, 'db', {
    get: function(){
      return db;
    }
  });
  
  Object.defineProperty(Role, 'table', {
    get: function(){
      return 'roles';
    }
  });
  
  Object.defineProperty(Role.prototype, 'id', {
    get: function(){
      return this._id;
    }
  });

  var persistentRole = require('../lib/persistent_objects')(Role);
  
	Role.prototype.save = persistentRole.save();
    
	Role.prototype.isNew = function() {
		return this._isNew;
	};
  
  Object.defineProperty(Role.prototype, 'name', {
    get: function(){
      return this._name;
    },
    set: function(n) {
      this._name = n;
    }
  });

	// Static methods
	
  Role.destroy = persistentRole.destroy('name');
  
  Role.count = persistentRole.count;

  Role.findNameOfLevel = function(rl, callback) {
    persistentRole.findOneObject('level = ?', [rl], function(err, theRole) {
      callback(err, theRole.name);
    });
  };
  
  return Role;
}

module.exports = function(db) {
	require('./../lib/extensions');
  var util = require('util');
	
	var User = require('./users')(db);
      
  var Notice = function(options) {
    if (options) {
      this._heading = options.heading;
      this._body = options.body;
      this._userId = options.ownerId
      this._recipientIds = [];
      if (options.recipients)
        this._recipientIds = [this._userId].concat(options.recipients.split(',').map(function(i) { return parseInt(i);}));
			this._isNew = true;
    }
  };
  
  Notice.persistentProperties = ['_heading', '_body', '_userId'];
  
  Object.defineProperty(Notice, 'db', {
    get: function(){
      return db;
    }
  });
  
  Object.defineProperty(Notice, 'table', {
    get: function(){
      return 'notices';
    }
  });
  
  var persistentNotice = require('../lib/persistent_objects')(Notice);
  
  Notice.prototype.isValid = function() {
    return this._body != '' && this._heading != '';
  };
  
  Object.defineProperty(Notice.prototype, 'id', {
    get: function(){
      return this._id;
    }
  });
  
  Object.defineProperty(Notice.prototype, 'userId', {
    get: function(){
      return this._userId;
    }
  });
  
  Object.defineProperty(Notice.prototype, 'updatedAt', {
    get: function(){
      return this._updatedAt;
    }
  });
  
  Object.defineProperty(Notice.prototype, 'createdAt', {
    get: function(){
      return this._createdAt;
    }
  });
  
  Object.defineProperty(Notice.prototype, 'recipientIds', {
    get: function() {
      return this._recipientIds;
    }
  })
  
  Object.defineProperty(Notice.prototype, 'recipientList', {
    get: function() {
      return this._recipientIds.join(', ');
    }
  })
  
  Object.defineProperty(Notice.prototype, 'heading', {
    get: function(){
      return this._heading;
    },
    set: function(h) {
      this._heading = h;
    }
  });

  Object.defineProperty(Notice.prototype, 'body', {
    get: function(){
      return this._body;
    },
    set: function(b) {
      this._body = b;
    }
  });  

  Notice.prototype.owner = function(callback) {
    User.findById(this._userId, callback);
  };
  
  Notice.prototype.poster = function(callback) {
    this.owner(function(err, u) {
      callback(err, u.email.split('@')[0]);
    });
  };
  
  Notice.prototype.isPublic = function() {
    return this._recipientIds.length == 0;
  };
  
  Notice.prototype.saveRecipients = function(err, callback) {
    var self = this;
    var rids = this._recipientIds, maxRid = rids.length - 1;
    var insertOne = function(n) {
      db.insert('notices_readers', {user_id: rids[n], notice_id: self._id }, 
                                    function(err) {
                                      if (n == 0)
                                        callback(err);
                                      else
                                        insertOne(n-1);
                                    });
    };
    if (maxRid > 0)
      insertOne(maxRid);
    else
      callback(err);
  };
  
	Notice.prototype.save = persistentNotice.save(
    function(n) { return n.isValid(); },
    'Invalid data', 
    'saveRecipients'
  );
    
	Notice.prototype.isNew = function() {
		return this._isNew;
	};
	// Static methods
	
  Notice.destroy = persistentNotice.destroy('id');
  
  Notice.count = persistentNotice.count;
  
  Notice.getRecipients = function(notice, callback) {
    db.fetchAll('select user_id from notices_readers where notice_id = ?', [notice._id], 
                function(err, us ) {
                  notice._recipientIds = us.map(function(u, i, o) { return u.user_id; });
                  callback(err);
                });
  };

  Notice.getAllRecipients = function(notices, callback) {
    var fun = function f(i) {
      Notice.getRecipients(notices[i], function(err, n) {
        if (i == 0)
          callback(err);
        else
          f(i-1);
      });
    };
    fun(notices.length-1);
  };
  
  return Notice;
}
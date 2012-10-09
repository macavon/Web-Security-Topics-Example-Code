module.exports = function(db) {
	
	var bcrypt = require('bcrypt'),
			rbytes = require('rbytes');

	var weakPassword = function(pw) {
	  return !pw || pw.length < 8 || 
	  !(/\d/).test(pw) || !(/[a-z]/).test(pw) || !(/[A-Z]/).test(pw);
	};

	var validEmail = function(e) {
	    return e && e.length < 255 && e.length >= 6 &&
	    (/^[^@\s]+@([-a-z0-9]+\.)+([a-z]{2,4}|museum)$/i).test(e);
	};

	var User = function(options) {
		if (options) {
			this.email = options.email;
			this.password = options.password;
			this.openId = 'OID';
      this.roleLevel = 0;
			this._isNew = true;
			this.resetToken = false;
		}
	};
  
  // Persistence rubric
  User.persistentProperties = ['_emailAddress', '_passwordHash', '_passwordResetToken', '_openId', '_roleLevel'];
  
  Object.defineProperty(User, 'db', {
    get: function(){
      return db;
    }
  });
  
  Object.defineProperty(User, 'table', {
    get: function(){
      return 'users';
    }
  });
  
  var persistentUser = require('../lib/persistent_objects')(User);
  
  // Persistence methods
	User.prototype.save = persistentUser.save(
    function(u) { return u._passwordOK && u._emailOK; }, 'You must provide a valid email address and password');
    
  User.destroy = persistentUser.destroy('email_address');
  
  User.count = persistentUser.count;
  
  // Standard properties
  Object.defineProperty(User.prototype, 'id', {
    get: function(){
      return this._id;
    }
  });

  Object.defineProperty(User.prototype, 'updatedAt', {
    get: function(){
      return this._updatedAt;
    }
  });
  
  Object.defineProperty(User.prototype, 'createdAt', {
    get: function(){
      return this._createdAt;
    }
  });
  
	User.prototype.isNew = function() {
		return this._isNew;
	};
  
  // Simple data properties
  Object.defineProperty(User.prototype, 'openId', {
    get: function(){
      return this._openId;
    },
    set: function(oid) {
      this._openId = oid;
    }
  });

  Object.defineProperty(User.prototype, 'roleLevel', {
    get: function(){
      return this._roleLevel;
    },
    set: function(r) {
      this._roleLevel = r;
    }
  });

  Object.defineProperty(User.prototype, 'roleName', {
    get: function(){
      return this._roleName;
    },
    set: function(n) {
      this._roleName = n;
    }
  });

  // Special data properties
	Object.defineProperty(User.prototype, 'resetToken', {
		get: function(attribute){
			return this._passwordResetToken;
		},
		set: function(t) {
	    this._passwordResetToken = t? rbytes.randomBytes(6).toHex():'';
		}
	});

	Object.defineProperty(User.prototype, 'email', {
		get: function(){
			return this._emailAddress;
		},
		set: function(e) {
	    this._emailOK = validEmail(e);
			this._emailAddress = e.toLowerCase();
		}
	});

	Object.defineProperty(User.prototype, 'password', {
		set: function(pw) {
	    this._passwordOK = !weakPassword(pw);
			this._passwordHash = bcrypt.hashSync(pw, bcrypt.genSaltSync(10));
		}
	});

	User.prototype.checkPassword = function(pw) {
	  return bcrypt.compareSync(pw, this._passwordHash);
	};
	
	// Static methods
  
  User.find = function(field, value, callback) {
    persistentUser.findOneObject(field + ' = ?', [value],
                    function(err, theUser) {
                      if (!err && theUser) theUser._emailOK = theUser._passwordOK = true;
                      callback(err, theUser);
                    });
  };

	User.findByPasswordResetToken = function(e, callback) {
		User.find('password_reset_token', e, callback);
	};

	User.findByEmail = function(e, callback) {
		User.find('email_address', e, callback);
	};

	User.findById = function(i, callback) {
		User.find('id', i, callback);
	};

	User.findByOpenId = function(oid, callback) {
		User.find('open_id', oid, callback);
	};

	User.checkCredentials = function(e, pw, callback) {
	  this.findByEmail(e, function(err, u){
			if (u == null)
			 	err = new Error('unknown user');
			else
				if (!u.checkPassword(pw))
					err = new Error('incorrect password');
	    callback(err, u);
	  });
	};
  
  User.prototype.checkAdmin = function(callback) {
    var self = this;
    // db.fetchRow('select * from users where role_level = 999 and id = ?', self.id, function(err, u) {
    //   callback(!err && u);
    // });
    db.fetchRow('select * from admins where user_id = ?', self.id, function(err, u) {
      callback(!err && u);
    });
  };
  
	return User;
}
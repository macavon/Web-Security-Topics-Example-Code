module.exports = function(db) {
	require('./../lib/extensions');
	
  var Signature = function(options) {
    if (options) {
      this._sigText = options.sig_text;
      this._userId = options.ownerId
			this._isNew = true;
    }
  };
  
  Signature.persistentProperties = ['_sigText', '_userId'];
  
  Object.defineProperty(Signature, 'db', {
    get: function(){
      return db;
    }
  });
  
  Object.defineProperty(Signature, 'table', {
    get: function(){
      return 'signatures';
    }
  });
  
  var persistentSignature = require('../lib/persistent_objects')(Signature);
  
	Signature.prototype.save = persistentSignature.save();
    
	Signature.prototype.isNew = function() {
		return this._isNew;
	};
  
  Object.defineProperty(Signature.prototype, 'sigText', {
    get: function(){
      return this._sigText;
    },
    set: function(t) {
      this._sigText = t;
    }
  });

	// Static methods
	
  Signature.destroy = persistentSignature.destroy('id');
  
  Signature.count = persistentSignature.count;

  Signature.findForUser = function(uid, callback) {
    persistentSignature.findOneObject('user_id = ?', [uid], callback);
  };
  
  return Signature;
}
module.exports = function(db) {

  // Constructor
  var Thing = function(options) {
    if (options) {
      this._numberOfLegs = options.numberOfLegs;
      this._colour = options.colour;
			this._isNew = true;
    }
  };

  // Persistence rubric
  Thing.persistentProperties = ['_numberOfLegs', '_colour'];
  
  Object.defineProperty(Thing, 'db', {
    get: function(){
      return db;
    }
  });
  
  Object.defineProperty(Thing, 'table', {
    get: function(){
      return 'things';
    }
  });

  var persistentThing = require('../lib/persistent_objects')(Thing);

  // Persistence methods
	Thing.prototype.save = persistentThing.save(
    function(t) {
        return t.colour != '' && t.numberOfLegs >= 1;
      },
    'Invalid data'
  );
	
  Thing.destroy = persistentThing.destroy('id');
  
  Thing.count = persistentThing.count;

  // Standard properties
  Object.defineProperty(Thing.prototype, 'id', {
    get: function(){
      return this._id;
    }
  });
  
  Object.defineProperty(Thing.prototype, 'updatedAt', {
    get: function(){
      return this._updatedAt;
    }
  });
  
  Object.defineProperty(Thing.prototype, 'createdAt', {
    get: function(){
      return this._createdAt;
    }
  });
  
	Thing.prototype.isNew = function() {
		return this._isNew;
	};
  
  // Data properties
  Object.defineProperty(Thing.prototype, 'numberOfLegs', {
    get: function(){
      return this._numberOfLegs;
    },
    set: function(n) {
      this._numberOfLegs = n;
    }
  });

  Object.defineProperty(Thing.prototype, 'colour', {
    get: function(){
      return this._colour;
    },
    set: function(c) {
      this._colour = c;
    }
  });  
  
  // Finders
  Thing.findById = function(i, callback) {
    persistentThing.findOneObject('id = ?', [i], callback);
  };
    
  Thing.findByColour = function(c, callback) {
    persistentThing.findManyObjects('colour = ?', [c], callback);
  };

  Thing.findByMinimumNumberOfLegs = function(n, callback) {
    persistentThing.findManyObjects('number_of_legs >= ?', [n], callback);
  };

  return Thing;
}

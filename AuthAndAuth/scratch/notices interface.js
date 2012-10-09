var Notice = function(options) // Constructor
  
//   Read-Only Properties
'id'        // The notice's id value
'userId'    // The foreign key
'updatedAt' // Modification time stamp
'createdAt' // Creation time stamp
'poster'    // The owner's email address's local part

//   Properties
'heading'
'body'  

// Instance methods

// Look up the User object for the owner and pass it to the callbacl
Notice.prototype.owner  = function(callback)
// Save the object to the database
Notice.prototype.save = function(callback)
// Return true iff the object has not been saved
Notice.prototype.isNew = function()
  
// Static methods

// Remove the object's data from the database
Notice.destroy = function(i, callback)
  
// Finders

// Find one object given its id and pass it to the callback
Notice.findById = function(i, callback)
// Find all the objects and pass them to the callback
Notice.all = function(callback)
// Find one object and pass it to the callback
// if it belongs to the user with user id i
Notice.findByIdRestrictedToUser = function(u, i, callback)
// Find all the objects belonging to the user with user id i
// and pass them to the callback
Notice.allRestrictedToUser = function(u, callback)
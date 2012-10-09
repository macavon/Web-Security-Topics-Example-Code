module.exports = function(app){
  var util = require('util');
  var User = app.models.user,
      Role = require('../models/roles')(User.db);
      
  var abe = new User({email: 'abe@abelardos.com.fd', password: 'Paswurd123'}),
      ed  = new User({email: 'eduardo@freemail.com.fd', password: 'Qwerty124'});
      
  var basic = new Role({level: 0, name: 'basic'}),
      premium = new Role({level: 1, name: 'premium'}),
      admin = new Role({level: 999, name: 'admin'});
      
  var loadUsers = function(callback) {
    abe.save(function(err) {
      ed.save(callback);
    });
  };
  
  var destroyUsers = function(callback) {
    User.destroy(abe.email, function(err) {
      User.destroy(ed.email, callback);
    });
  };
  
  var loadRoles = function(callback) {
    console.log('deleting users')
    basic.save(function(err) {
      premium.save(function(err) {
        admin.save(callback);
      })
    })
  };
  
  var destroyRoles = function(callback) {
    console.log('deleting roles')
    Role.destroy('basic', function(err) {
      Role.destroy('premium', function(err) {
        Role.destroy('admin', callback);
      })
    })
  };
  
  return {
    loadFixtures: function(callback) {
      util.log('loading fixtures\n')
      loadUsers(function(err) { loadRoles(callback); })
    },
  
    tearDown: function(callback) {
      destroyUsers(function(err) { destroyRoles(callback);})
    }
  }
}
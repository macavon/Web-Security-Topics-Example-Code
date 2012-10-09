module.exports = function(User) {
  var Role = require('../models/roles.js')(User.db);
  
  return {
    
    show: function(req, res) {
      res.render('user_records/show', {title: 'User Account', user: req.resource});
    },

    edit: function(req, res) {
      var u = req.resource;
      Role.findNameOfLevel(u.roleLevel, function(err, rn) {
        u.roleName = rn;
        res.render('user_records/edit', {title: 'Assign a Role', u: u})
      });
    },

    update: function(req, res) {
      var u = req.resource;
      var userData = req.body.user;
      u.roleLevel = userData.role_level;
      u.save(function(err) {
        if (err) {
          req.flash('error', 'An error occurred trying to change this user\'s role\n' + err.message);
          res.render('user_records/edit', {title: 'Assign a Role', u: u})
        }
        else {
          req.flash('info', 'The user\'s role has been updated');
          res.redirect('/enterprise/users');
        }
      });
    },

    destroy: function(req, res) {
      res.send('delete the account and associated stuff\n');
    },

    index: function(req, res) {
      res.render('user_records/index', {title: 'All Users', us: req.resources})
    }
  }
}

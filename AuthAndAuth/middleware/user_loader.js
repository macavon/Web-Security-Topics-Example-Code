module.exports = function(db) {
  var User = require('../models/users.js')(db);
  var Signature = require('../models/signature.js')(db);
  var Role = require('../models/roles.js')(db);
  
  var util = require('util');
  
  return {
    currentUser: function(req, res, next) {
      User.findById(req.userId, function(err, u) {
        if (err)
          res.render('error', {status: 500,
                               message: 'Server Error',
                               title: 'No Such User'});
         else {
           req.currentUser = u;
           Role.findNameOfLevel(u.roleLevel, function(err, rn) {
             u.roleName = rn;
             next(err);
           });
        }
      });
    },
    
    userSig: function(req, res, next) {
      Signature.findForUser(req.userId, function(err, sig) {
        if (err)
          res.render('error', {status: 500,
                               message: 'Server Error',
                               title: 'Database Error'});
         else {
           req.userSignature = sig || '';
           next();
         }
      });
    }
  }
}
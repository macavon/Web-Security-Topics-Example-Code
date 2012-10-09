module.exports = function(User) {
  return {
    // GET /login
    new: function(req, res) {
      res.render('logins/new', {title: 'Login', u: null})
    },
    
    // POST /login
    create: function(req, res) {
      User.checkCredentials(req.body.user.email, req.body.user.password, function(err, theUser) {
        if (!err) {
          req.session.userId = theUser.id;
          if (req.session.requestedUrl)
            res.redirect(req.session.requestedUrl)
          else
            res.render('logins/welcome', {title: 'Login successful'});
        }
        else {
          req.flash('error', err.message);
          res.render('logins/new', {title: 'Login', u: theUser});
        }
      });
    },
    
    // DELETE /logout
    destroy: function(req, res) {
      req.session.destroy(function(err) {
        res.render('logins/deleted', {title: 'Logged Out'});
      });
    }
  }
}

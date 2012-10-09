var openId = require('openid');
var openIdRelyingParty = new openId.RelyingParty(
  'http://www.abelardos.com.fd:3030/openid',
  null, false, false, []
);

module.exports = function(User) {  
  var authenticateWithOpenId = function(req, res) {
    var oid = req.body.user.open_id;
    openIdRelyingParty.authenticate(oid, false,
	    function(err, authURL) {
        if (err || !authURL) {
          req.flash('error', 'OpenId authentication failed');
          res.render('logins/new', {title: 'Login', u: null});
        }
        else
          res.redirect(authURL);
      });
  };
  
  var loginUser = function(req, res, theUser) {
      req.session.userId = theUser.id;
      if (req.session.requestedUrl)
        res.redirect(req.session.requestedUrl)
      else
  			res.redirect('/user');
  };
  
  return {
    // GET /login
    new: function(req, res) {
      res.render('logins/new', {title: 'Login', u: null, layout: 'blank-layout'})
    },
    
    // POST /login
    create: function(req, res) {
      if (req.body.user.open_id)
        authenticateWithOpenId(req, res);
      else {
        User.checkCredentials(req.body.user.email, req.body.user.password, function(err, theUser) {
          if (!err) 
            loginUser(req, res, theUser);
          else {
            req.flash('error', err.message);
            res.render('logins/new', {title: 'Login', u: theUser});
          }
        });
      }
    },
    // DELETE /logout
    destroy: function(req, res) {
      req.session.destroy(function(err) {
        res.render('logins/farewell', {title: 'Logged Out', layout: 'blank-layout'});
      });
    },
    
    // GET /openid
    validateOpenId: function(req, res) {
      var badOpenId = function() {
        req.flash('error', 'OpenId authentication failed');
        res.render('logins/new', {title: 'Login'});
      };
      openIdRelyingParty.verifyAssertion(req,
	      function(err, result) {
          if (err)
            badOpenId();
          else
          {
            User.findByOpenId(result.claimedIdentifier,
	            function(err, theUser) {
                if (err)
                  badOpenId();
                else
                  loginUser(req, res, theUser);
            });
          }
        });
    }
  }
}

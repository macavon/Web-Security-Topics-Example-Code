require('../lib/extensions.js');

var util = require('util');


module.exports = function(User) {
    return {
      restrictToAuthenticated: 
        function(authenticationMethod) {
          switch (authenticationMethod) {
           case 'none':
              return function(req, res, next) {
              next();
            }
            case 'url':
              return function(req, res, next) {
                if (req.query && req.query.userId) {
									req.userId = req.query.userId;
                  next();
								}
                else {
                  res.redirect('/login');
                }
            }
            case 'http-basic':
              return function(req, res, next) {
                var sendChallenge = function() {
                  res.header('WWW-Authenticate', 'Basic realm="Authorized Personnel Only"');
                  res.redirect('unauthorized', 401);
                };

                if (!req.header('Authorization'))
                  sendChallenge();
                else {
                  var temp = req.header('Authorization').split(' ');
                  var authorizationType = temp[0], encodedCredentials = temp[1];
                  if (authorizationType != 'Basic')
                    sendChallenge();
                  else {
                    var decodedCredentials = encodedCredentials.base64Decode();
                    var temp2 = decodedCredentials.split(':');
                    var username = temp2[0], password = temp2[1];
                    User.checkCredentials(username, password, function(err, u) {
                      if (!err) {
                        req.userId = u.id;
                        next();
                      }
                      else
                        sendChallenge();
                    });
                  }
                }
              }
              case 'session':
              default:
                return function(req, res, next) {
                  if (req.session && req.session.userId) {
                    req.userId = req.session.userId;
                    next();
                  }
                  else {
                    if (req.method == 'GET')
                      req.session.requestedUrl = req.url;
                    res.redirect('/login');
                  }
              }
          }
        }
    } 
};
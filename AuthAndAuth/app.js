
/**
 * Module dependencies.
 */

var express = require('express');

var DBWrapper = require('node-dbi').DBWrapper;


// Create the application
var app = module.exports = express.createServer(
	express.cookieParser(),
	express.session({secret: 'chrerv9yov'})
	);

// Environments
app.configure('test', function() {
  app.set('dbname', 'test');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.set('dbname', 'development');
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  app.set('dbname', 'production');
});

// Configuration options
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('auth_method', process.argv[2] || 'session');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({secret: 'chrerv9yov'}));
});

// "Constants" for roles
var BASIC = 0, PREMIUM = 10, ENTERPRISE = 20, ADMIN = 999;

// Helpers and dynamic helpers
app.helpers({
	maybe: function(obj, prop) {
		return obj? obj[prop]: '';
	}
});

app.dynamicHelpers({ messages: require('express-messages') });
app.dynamicHelpers({
  loggedIn: function(req, res){  return req.userId; },
  currentUser: function(req, res) { return req.currentUser},
  role: function(req, res) { return req.currentUser&&req.currentUser.roleLevel; },
  adminUser: function(req, res) { return req.currentUser&&req.currentUser.roleLevel == ADMIN; },
  enterpriseUser: function(req, res) { return req.currentUser&&req.currentUser.roleLevel >= ENTERPRISE; },
  premiumUser: function(req, res) { return req.currentUser&&req.currentUser.roleLevel >= PREMIUM; },
  basicUser: function(req, res) { return req.currentUser&&req.currentUser.roleLevel >= BASIC; }// ,
                   }); 

// Connect to the database
var db = new DBWrapper('sqlite3', require('./db/config'));
db.connect();

// Models
var User = require('./models/users.js')(db);
var Notice = require('./models/notices.js')(db);
var Signature = require('./models/signature.js')(db);

app.models = {user: User, notice: Notice, signature: Signature};

// Middleware
var authentication = require('././middleware/authentication')(User),
    restrictToAuthenticated = authentication.restrictToAuthenticated(app.set('auth_method'));

var noticeAuthorization = require('./middleware/authorization_filters')('notice'),
    allNotices = noticeAuthorization.allResources,
    oneNotice = noticeAuthorization.whereId,
    usersNotice = noticeAuthorization.whereUser,
    receivedNotice = noticeAuthorization.whereReader;
    
var userAdminAuthorization = require('./middleware/authorization_filters')('user'),
    allUsers = userAdminAuthorization.allResources,
    oneUser = userAdminAuthorization.whereId;
    
var sigAuthorization = require('./middleware/authorization_filters')('signature'),
    allSignatures = sigAuthorization.allResources,
    usersSignature = sigAuthorization.whereUser;
    
var roleAuthorization = require('./middleware/authorization_by_role'),
    // adminOnly = roleAuthorization.restrictToAdmin,
    adminOnly = roleAuthorization.restrictToRole(ADMIN),
    enterpriseOnly = roleAuthorization.restrictToRole(ENTERPRISE),
    premiumOnly = roleAuthorization.restrictToRole(PREMIUM);

var mwWrap =require('./lib//middleware-wrapper').wrap;

var noticeLoader = require('./middleware/resource_loader')(Notice);

var loadOneNotice = noticeLoader.loadOne,
    loadManyNotices = noticeLoader.loadMany;

var loadOneNoticesRecipients = mwWrap(Notice.getRecipients, 'resource'),
    loadManyNoticesRecipients = mwWrap(Notice.getAllRecipients, 'resources');
    
var loadNoticeSignature = function(req, res, next) {
  Signature.findForUser(req.resource.userId, function(err, theSig) {
    req.noticeSignature = theSig?theSig.sigText: '';
    next(err);
  });
};

var userLoader = require('./middleware/user_loader')(db),
    loadCurrentUser = userLoader.currentUser,
    loadUserSignature = userLoader.userSig;

var userAdminLoader = require('./middleware/resource_loader')(User);

var loadOneUser = [userAdminLoader.loadOne, function(req, res, next) { 
                      req.resource._emailOK = req.resource._passwordOK = true;
                      next();
                  }],
    loadManyUsers = userAdminLoader.loadMany;

var user_filters = require('./middleware/user_filters')(User),
		reject_duplicate_email = user_filters.reject_duplicate_email;

// Middleware stacks
var restrictToAuthenticatedUser = [restrictToAuthenticated, loadCurrentUser];

var restrictToPremiumUser = [restrictToAuthenticated, loadCurrentUser, premiumOnly];

var restrictToEnterpriseUser = [restrictToAuthenticated, loadCurrentUser, enterpriseOnly];
    
var restrictToAdministrator = [restrictToAuthenticated, loadCurrentUser, adminOnly];
    
var restrictToOwnersNotice = [allNotices, oneNotice, usersNotice, loadOneNotice, loadOneNoticesRecipients],
    restrictToOwnersNotices = [allNotices, usersNotice, loadManyNotices, loadManyNoticesRecipients],
    allowAnyNotice = [allNotices, oneNotice, loadOneNotice, loadOneNoticesRecipients],
    allowAnyNotices = [allNotices, loadManyNotices, loadManyNoticesRecipients],
    restrictToReceivedNotices = [allNotices, receivedNotice, loadManyNotices, loadManyNoticesRecipients],
    restrictToReceivedNotice = [allNotices, oneNotice, receivedNotice, loadOneNotice, loadOneNoticesRecipients, loadNoticeSignature];
    
var allowAnyUser = [allUsers, oneUser, loadOneUser],
    allowAnyUsers = [allUsers, loadManyUsers];

// Controllers
var userController = require('./controllers/user_controller')(User),
		passwordResetController = require('./controllers/password_reset_controller')(User),
		loginController = require('./controllers/login_controller')(User),
		authenticatedOnlyController = require('./controllers/authenticated_only_controller')(User),
    noticesController = require('./controllers/notices_controller')(Notice),
    sigController = require('./controllers/signatures_controller')(Signature),
    userRecordsController = require('./controllers/user_records_controller')(User);

// Routes
app.get ('/user', restrictToAuthenticatedUser, userController.show);
app.get ('/user/new', userController.new);
app.post('/user', reject_duplicate_email, userController.create);
app.get ('/user/edit', restrictToAuthenticatedUser, userController.edit);
app.put ('/user', restrictToAuthenticatedUser, userController.update);
app.del ('/user', restrictToAuthenticatedUser, userController.destroy);

app.get ('/password_reset/request', passwordResetController.new);
app.post('/password_reset', passwordResetController.create);
app.get ('/password_reset/:token', passwordResetController.edit);
app.put ('/password_reset', passwordResetController.update);

app.get ('/login', loginController.new);
app.post('/login', loginController.create);
app.del ('/logout', restrictToAuthenticated, loginController.destroy);

app.get ('/openid', loginController.validateOpenId);

app.get ('/authenticated_only/new', authenticatedOnlyController.new);
app.get ('/authenticated_only/:id([0-9]+)', restrictToAuthenticatedUser, authenticatedOnlyController.show);
app.post('/authenticated_only', restrictToAuthenticatedUser, authenticatedOnlyController.create);
app.get ('/authenticated_only/hijack', authenticatedOnlyController.hijack);
// app.get ('/unauthorized', authenticatedOnlyController.unauthorized);

app.all('/user/:resource/:id?/:op?', restrictToAuthenticatedUser);
app.get ('/user/notices/new', noticesController.new);
app.post('/user/notices', noticesController.create);
app.get ('/user/notices', restrictToReceivedNotices, noticesController.index);
app.get ('/user/notices/:id', restrictToReceivedNotice, noticesController.show);
app.get ('/user/notices/:id/edit', restrictToOwnersNotice, noticesController.edit);
app.put ('/user/notices/:id', restrictToOwnersNotice, noticesController.update);
app.del ('/user/notices/:id', restrictToOwnersNotice, noticesController.destroy);

app.all('/premium/:resource/:id?/:op?', restrictToPremiumUser);
app.get ('/premium/signature', loadUserSignature, sigController.show);
app.get ('/premium/signature/new', sigController.new);
app.post('/premium/signature', sigController.create);
app.get ('/premium/signature/edit', loadUserSignature, sigController.edit);
app.put ('/premium/signature', loadUserSignature, sigController.update);
app.del ('/premium/signature', loadUserSignature, sigController.destroy);

app.all('/enterprise/:resource/:id?/:op?', restrictToEnterpriseUser);
app.get ('/enterprise/users', allowAnyUsers, userRecordsController.index);
app.get ('/enterprise/users/:id', allowAnyUser, userRecordsController.show);

app.all('/admin/:resource/:id?/:op?', restrictToAdministrator);
app.get ('/admin/users/:id/edit', allowAnyUser, userRecordsController.edit);
app.put ('/admin/users/:id', allowAnyUser, userRecordsController.update);
app.del ('/admin/users/:id', allowAnyUser, userRecordsController.destroy);

// Default route -> login
app.get ('/', loginController.new);


// Start
if (!module.parent) {
  app.listen(3030);
  console.log("Express server listening on port %d", app.address().port);
}

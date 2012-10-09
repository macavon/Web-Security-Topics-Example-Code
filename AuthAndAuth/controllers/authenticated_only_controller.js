module.exports = function(User) {
	var currentUser = require('../middleware/authentication')(User).currentUser;
	
	return {
		show: function(req, res) {
			if (err)
				req.flash('error', err.message);
			res.render('authenticated_only/show', { title: 'Restricted',
																							 id: req.params.id,
																							  user: req.currentUser});
		},	
		new: function(req, res) {
			res.render('authenticated_only/new', {title: 'Unrestricted'});
		},
		create: function(req, res) {
			res.render('authenticated_only/create', {title: 'Restricted',
			                                          requestData: req.body.data,
			                                          user: req.currentUser});
		},
		unauthorized: function(req, res) {
			res.render('authenticated_only/unauthorized', {title: 'Unauthorized Access'});
		},
		
		hijack: function(req, res) {
			var url = require('url');
			res.render('authenticated_only/hijack', {title: 'Hijacked',
			                                         uid: url.parse(req.header('Referer'), true).query.userId});
		}
	}
}
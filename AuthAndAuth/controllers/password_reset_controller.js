module.exports = function(User) {
	var send_reset_message = require('../lib/reset').send_reset_message;
	
	return {
		new: function(req, res){
			res.render('password_resets/new', { title : 'Request Password Reset', u: null});
		},

		create: function(req, res){
			var address = req.body.user.email;
			User.findByEmail(address, function(err, theUser) {
				if (theUser && !err) {
					theUser.resetToken = true;
					theUser.save(function(err) {
						if (err) {
							req.flash('error', err.message);
							res.render('password_resets/new', { title : 'Request Password Reset', u: theUser});
						}
						else 
							send_reset_message(theUser, res);
					})
					
				}
				else {
					req.flash('error', 'There is no account with email address ' + address);
					res.render('password_resets/new', { title : 'Request Password Reset', u: null});
				}
			});
		},

		edit: function(req, res){
			User.findByPasswordResetToken(req.params.token, function(err, theUser) {
				if (theUser && !err)
					res.render('password_resets/edit', {title: 'Reset Password', u: theUser});
				else
					res.redirect('password_resets/new', 404);
			});
		},

		update: function(req, res){
			var userData = req.body.user;
			User.findByEmail(userData.email, function(err, theUser) {
				var badUpdate = function(message) {
					req.flash('error', message);
					res.render('password_resets/edit', {title: 'Reset Password', u: theUser});
				};

				if (theUser && !err &&
					  theUser.resetToken == userData.reset_token &&
						userData.password == userData.confirm) {
					theUser.resetToken = false;
					theUser.password = userData.password;
					theUser.save(function(err) {
						if (err)
							badUpdate(err.message);
						else
							res.render('password_resets/updated', {title: 'Password successfully reset'});
					});
				}
				else
					badUpdate('could not reset the password, bad data');
			});
		}
	}
}
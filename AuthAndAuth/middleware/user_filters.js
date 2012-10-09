module.exports = function(User) {
	return {
		reject_duplicate_email: function(req, res, next) {
			var userData = req.body.user;
			User.findByEmail(userData.email, function(err, u) {
				if (u) {
					req.flash('error', 'An account already exists with email address ' + u.email);
					res.redirect('back');
				}
				else
					next();
			});
		}
	};
}
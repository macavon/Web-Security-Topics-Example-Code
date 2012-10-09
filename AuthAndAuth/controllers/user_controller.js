module.exports = function(User) {
	
	return {
		// GET /user/new
		new: function(req, res){
			res.render('users/new',
				{title: 'Sign up',
				 u: null,
         layout: 'blank-layout'
			});
		},
    
		// POST /user
		create: function(req, res){
			var userData = req.body.user;
			var theUser = new User(userData);
			var badSignUpForm = function(e) {
				req.flash('error', e);
				res.render('users/new',
					{title: 'Error in sign-up form',
           u: theUser,
           layout: 'blank-layout'
				});
			};
			if (userData.password == userData.confirm) {
				theUser.save(function(err) {
					if (err)
						badSignUpForm(err.message);
					else {
						req.flash('info', 'Your account has been created');
            req.userId = req.session.userId = theUser.id;
						res.redirect('/user', { title: 'Your account', user: theUser});
					}
				});
			}
			else
				badSignUpForm('Your password and its confirmation must match');
		},
    
		// GET /user
		show: function(req, res){
			res.render('users/show', {
				title: 'Your account',
				user: req.currentUser
			});
		},
    
		// GET /user/edit
		edit: function(req, res){
			res.render('users/edit', {
				title: 'Edit your account',
				user: req.currentUser
			});
		},
    
		// PUT /user
		update: function(req, res){
      var theUser = req.currentUser;
			var badEditForm = function(e) {
				req.flash('error', e);
				res.render('users/edit',
					{title: 'Error making changes',
           u: theUser,
           layout: 'blank-layout'
				});
			};
			var changes = false;
			var newUserData = req.body.user;
			if (theUser.checkPassword(newUserData.old_password)) {
				if (newUserData.email && newUserData.email != theUser.email) {
					theUser.email = newUserData.email;
					changes = true;
				}
				if (newUserData.openid_url && newUserData.openid_url != theUser.openId) {
					theUser.openId = newUserData.openid_url;
					changes = true;
				}
				if (newUserData.password)
						if (newUserData.password == newUserData.confirm) {
							theUser.password = newUserData.password;
							changes = true;
						}
						else 
							badEditForm('Your new password and its confirmation must match');
			}
			else
				badEditForm('Incorrect password – you must enter your old password to make these changes.')
				if (changes) {
					theUser.save(function(err) {
						if (err)
							badEditForm(err.message);
						else {
							req.flash('info', 'Your account details have been changed');
							res.render('users/show', { title: 'Your account', user: theUser});
						}
					});
				}
		},
    
		// DELETE /user
		destroy: function(req, res){
			var e = req.currentUser.email;
			User.destroy(e);
      req.session.destroy();
			res.render('users/delete', {
				title: 'Your account has been deleted',
				email: e,
        layout: 'blank-layout'
			})
		}
	}
}
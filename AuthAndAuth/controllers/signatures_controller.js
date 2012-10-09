module.exports = function(Signature) {
  
  return {
    show: function(req, res) {
      res.render('signatures/show', {title: 'Your Signature', s: req.userSignature});
    },
    
    new: function(req, res) {
      res.render('signatures/new', {title: 'Create a Signature', s: null});
    },

    create: function(req, res) {
      var sigData = req.body.signature;
      sigData.ownerId = req.userId;
      var theSignature = new Signature(sigData);
      theSignature.save(function(err) {
        if (err) {
          req.flash('error', 'An error occurred trying to create your signature\n' + err.message);
          res.render('signatures/new', {title: 'Create a Signature', s: theSignature});
        }
        else {
          req.flash('info', 'Your signature has been created');
          res.redirect('/user/notices');
        }
      })
    },

    edit: function(req, res) {
        res.render('signatures/edit', {title: 'Edit Signature', s: req.userSignature})
    },

    update: function(req, res) {
      var s = req.userSignature;
      var sigData = req.body.signature;
      s.sigText = sigData.sig_text;
      s.save(function(err) {
        if (err) {
          req.flash('error', 'An error occurred trying to update your signature\n' + err.message);
          res.render('signatures/edit', {title: 'Edit Signature', s: s})
        }
        else {
          req.flash('info', 'Your signature has been updated');
          res.redirect('/user/notices');
        }
      });
    },

    // destroy: function(req, res) {
    //   Notice.destroy(req.param('id'), function(err) {
    //     if (err)
    //       res.redirect('/505.html', 505);
    //     else {
    //       req.flash('info', 'That notice has been removed');
    //       res.redirect('/user/notices');
    //     }
    //   });
    // }
  }
}

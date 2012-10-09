module.exports = function(Notice) {
  
  return {
    show: function(req, res) {
      req.resource.poster(function(err, p) {
        res.render('notices/show', {title: 'Notice', n: req.resource, poster: p, sig: req.noticeSignature,
                                    readOnly: !req.myResource})
      });
    },

    new: function(req, res) {
      res.render('notices/new', {title: 'Post a Notice', n: null});
    },

    create: function(req, res) {
      var noticeData = req.body.notice;
      noticeData.ownerId = req.userId;
      var theNotice = new Notice(noticeData);
      theNotice.save(function(err) {
        if (err) {
          req.flash('error', 'An error occurred trying to create this notice\n' + err.message);
          res.render('notices/new', {title: 'Post a Notice', n: theNotice});
        }
        else {
          req.flash('info', 'Your notice has been posted');
          res.redirect('/user/notices');
        }
      })
    },

    edit: function(req, res) {
        res.render('notices/edit', {title: 'Edit Notice', n: req.resource})
    },

    update: function(req, res) {
      var n = req.resource;
      var noticeData = req.body.notice;
      n.heading = noticeData.heading;
      n.body = noticeData.body;
      n.save(function(err) {
        if (err) {
          req.flash('error', 'An error occurred trying to create this notice\n' + err.message);
          res.render('notices/edit', {title: 'Edit Notice', n: n})
        }
        else {
          req.flash('info', 'Your notice has been updated');
          res.redirect('/user/notices');
        }
      });
    },

    destroy: function(req, res) {
      Notice.destroy(req.param('id'), function(err) {
        if (err)
          res.redirect('/505.html', 505);
        else {
          req.flash('info', 'That notice has been removed');
          res.redirect('/user/notices');
        }
      });
    },

    index: function(req, res) {
        res.render('notices/index', {title: 'All notices', ns: req.resources})
    }
  }
}
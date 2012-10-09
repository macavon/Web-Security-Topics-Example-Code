module.exports = {
  send_reset_message: function(user, res) {
    res.render('password_resets/created', {title: 'Reset Message', u: user, layout: 'blank-layout'});
  }
}

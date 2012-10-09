module.exports =  {
  restrictToAdmin: function(req, res, next) {
    req.currentUser.checkAdmin(function(isAdmin) {
      if (isAdmin)
        next();
      else
        res.render('forbidden', {status: 403,
                                 message: 'Forbidden',
                                 title: 'Access Forbidden',
                                 layout: 'blank-layout'});
    })
  },
  
  restrictToRole: function(level) {
   return  function(req, res, next) {
      if (req.currentUser.roleLevel >= level)
        next();
      else
        res.render('forbidden', {status: 403,
                                 message: 'Forbidden',
                                 title: 'Access Forbidden',
                                 layout: 'blank-layout'});
        
    };
  }
}
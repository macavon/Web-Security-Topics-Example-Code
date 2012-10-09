module.exports = function(resource) {

  var persistentResource = require('../lib/persistent_objects')(resource);
  return {
    loadOne: function(req, res, next) {
      persistentResource.findOneObject(req.dbQuery, req.dbQueryValues,
        function(err, theResource) {
          if (err)
            res.render('error', {status: 500,
                                 message: 'Server Error',
                                 title: 'Server Error',
                                 layout: 'blank-layout'});
            else
              if (!theResource)
                res.render('notfound', {status: 404,
                                        message: 'Not Found',
                                        title: 'Page Not Found',
                                        layout: 'blank-layout'})
              else {
                req.resource = theResource;
                req.myResource = theResource.userId == req.userId;
                next();
              }
            });
      },
    
    // You could define separate loadOne and loadAnyOne methods and then send a different status when
    // nothing was retrieved, but you can't be sure which case it was anyway.
    
    loadMany: function(req, res, next) {
      persistentResource.findManyObjects(req.dbQuery, req.dbQueryValues,
        function(err, theResources) {
          if (err)
            res.render('error', {status: 500,
                                 message: 'Server Error',
                                 title: 'Server Error',
                                 layout: 'blank-layout'});
          else {
            req.resources = theResources;
            next();
          }
        });
    }
  };
}

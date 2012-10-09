module.exports = function(tablePrefix) {
  
  var table = tablePrefix + 's';
  var joinTable = table + '_readers';
  var key = tablePrefix + '_id';
  
  return {
    allResources: function(req, res, next) {
       req.dbQuery = '';
       req.dbQueryValues = [];
       next();
    },
    
    whereId: function(req, res, next) {
      var queryPart = ' id = ?';
      req.dbQuery = req.dbQuery? req.dbQuery + ' and ' + queryPart: queryPart;
      req.dbQueryValues.push(req.param('id'));
      next();
    },
    
    whereUser: function(req, res, next) {
      var queryPart = ' user_id = ?';
      req.dbQuery = req.dbQuery? req.dbQuery + ' and ' + queryPart: queryPart;
      req.dbQueryValues.push(req.userId);
      next()
    },
    
    whereReader: function(req, res, next) {
      var queryString1 = 'not exists (select * from ' + joinTable + ' where ' + key + ' = ' + table + '.id)';
      var queryString2 = 'id in (select ' + key + ' from ' + joinTable + ' where user_id = ?)';
      var queryString = '(' + queryString1 + ' or ' + queryString2 + ')';
      req.dbQuery = req.dbQuery? req.dbQuery + ' and ' + queryString: queryString;
      req.dbQueryValues.push(req.userId);
      next()
    }
  }
}
var app = require('../app');

console.log();
app.routes.all().forEach(function(route){
  console.log('  \033[90m%s \033[36m%s\033[0m', route.method.toUpperCase(), route.path);
});
console.log();
process.exit();

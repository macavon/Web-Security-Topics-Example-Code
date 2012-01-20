var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("<html><head></head><body><h1>Secure Site</h1>\</body></html>\n");
}).listen(4430);
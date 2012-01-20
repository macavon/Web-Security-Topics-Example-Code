var tls = require('tls');
var fs = require('fs');

var options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

tls.createServer(options, function (s) {
	s.setEncoding('utf8');
  s.write("welcome!\n> ");
	s.addListener('data', function(d) {
		console.log(d);
		s.write("<< " + d + "> ");
	});
}).listen(8000);
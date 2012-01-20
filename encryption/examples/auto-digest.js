var crypto = require('crypto');
var fs = require('fs');
var h = crypto.createHash('sha256');

var inStream = fs.ReadStream(__filename);
inStream.addListener('data', function(data) {
  h.update(data);
});
inStream.addListener('end', function() {
	console.log(h.digest('hex')+'\n');
});


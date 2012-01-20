var crypto = require('crypto');
var fs = require('fs');

var passPhrase = 'a flock of swordfish';
var h = crypto.createHmac('sha256', passPhrase);

var inStream = fs.ReadStream(__filename);
inStream.addListener('data', function(data) {
  h.update(data);
});
inStream.addListener('end', function() {
	console.log(h.digest('hex')+'\n');
});


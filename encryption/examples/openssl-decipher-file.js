var crypto = require('crypto');
var fs = require('fs');

var BLOCKLENGTH = 4800; // 24 bytes = 192 bits
var CRYPTFILENAME = 'zzz.txt';

var passPhrase = 'a flock of swordfish';

var d = crypto.createDecipher('aes-192-cbc', passPhrase);
var decryptStream = fs.createReadStream(CRYPTFILENAME,
                       {buffersize: BLOCKLENGTH, encoding: 'utf8'});
decryptStream.addListener('data', function(data) {
  process.stdout.write(d.update(data));
});
decryptStream.addListener('end', function() {
  process.stdout.write(d.final());
});


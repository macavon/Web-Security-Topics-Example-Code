var crypto = require('crypto');
var fs = require('fs');

var BLOCKLENGTH = 4800; // 24 bytes = 192 bits
var CRYPTFILENAME = 'zzz.txt';

var passPhrase = 'a flock of swordfish';

var c = crypto.createCipher('aes-192-cbc', passPhrase);

var plainStream = fs.createReadStream(__filename,
                     {buffersize: BLOCKLENGTH, encoding: 'utf8'});
var cryptStream = fs.createWriteStream(CRYPTFILENAME,
                     {buffersize: BLOCKLENGTH, encoding: 'utf8'});
plainStream.addListener('data', function(data) {
  cryptStream.write(c.update(data, 'utf8'));
});

plainStream.addListener('end', function() {
  cryptStream.write(c.final());
});


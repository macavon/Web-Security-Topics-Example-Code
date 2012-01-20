var crypto = require('crypto');

var h = crypto.createHash('sha256');
h.update('Able was I ere I saw Elba');

console.log(h.digest('hex')+'\n');

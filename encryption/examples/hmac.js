var crypto = require('crypto');

var h = crypto.createHmac('sha256', 'a flock of swordfish');
h.update('Able was I ere I saw Elba');

process.stdout.write(h.digest('hex')+'\n');

var Shifter = require('../lib/xor-base64-cipher-stream');
// var Shifter = require('../lib/random-shift-cipher-stream');
var sh = new Shifter('dskijkfpie fweofi erghamsmcalwe');

var s = 'Able was I ere I saw Elba';
var x = sh.encrypt(s);
var ss = sh.decrypt(x);

process.stdout.write('  ' + s + '\n->' + x + '\n->' + ss + '\n');

// process.stdout.write(sh5.encrypt(s) + '\n');
// process.stdout.write(sh3.encrypt(s) + '\n');
// process.stdout.write(sh5.encrypt(s) + '\n');

var Shifter = require('../lib/shift-cipher');

var sh5 = new Shifter(5);
// var sh3 = Shifter.create(3);

var s = 'Able was I ere I saw Elba';
var x = sh5.encrypt(s);
var ss = sh5.decrypt(x);

process.stdout.write('  ' + s + '\n->' + x + '\n->' + ss + '\n');

// process.stdout.write(sh5.encrypt(s) + '\n');
// process.stdout.write(sh3.encrypt(s) + '\n');
// process.stdout.write(sh5.encrypt(s) + '\n');

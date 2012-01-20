var util = require('util');

var Transposition = require('../lib/transposition-cipher');

var s = 'Meet me tonight where the flying fishes play Abel X';

var tr = new Transposition('GWENDA');
var ss = tr.encrypt(s);
process.stdout.write(ss);
process.stdout.write(tr.decrypt(ss));

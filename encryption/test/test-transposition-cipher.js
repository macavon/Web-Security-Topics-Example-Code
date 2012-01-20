var util = require('util');

var Cipher = require('../lib/transposition-cipher.js');
var t = new Cipher('GWENDA');
var s = 'Able was I ere I saw Elba88888';
var st = t.encrypt(s);
var sn = s.replace(/\s/g, '').toUpperCase();

process.stdout.write(st);
process.stdout.write(t.decrypt(st));
process.stdout.write(sn);

exports['changes'] = function(test) {
  test.notEqual(s, st);
  test.done();
};

exports['pseudo-inverts'] = function(test) {
  test.equal(sn, t.decrypt(st));
  test.done();
};

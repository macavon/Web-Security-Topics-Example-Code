var util = require('util');

var Cipher = require('../lib/transposition-cipher.js');
var t = new Cipher('GWENDA');
var t1 = new Cipher('GLENDA');
var s = 'Able was I ere I saw Elba88888';
var st = t.encrypt(s);
var sn = s.replace(/\s/g, '').toUpperCase();

exports['changes'] = function(test) {
  test.notEqual(s, st);
  test.done();
};

exports['pseudo-inverts'] = function(test) {
  test.equal(sn, t.decrypt(st));
  test.done();
};

exports['does not pseudo-invert with wrong key'] = function(test) {
  test.notEqual(sn, t1.decrypt(st));
  test.done();
};

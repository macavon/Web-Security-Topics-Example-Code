require('./extensions.js');
util = require('util');

exports['invertible'] = function(test) {
  var s = 'some test string';
  test.equal(s, s.base64Encode().base64Decode());
  test.done();
};


// var s = 'some test string';
// var s64 = s.base64Encode();
// var ss = s64.base64Decode();
// process.stdout.write(s64);
// process.stdout.write(ss);

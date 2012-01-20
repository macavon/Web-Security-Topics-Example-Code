util = require('util');

['random-shift-cipher-stream', 'xor-base64-cipher-stream'].forEach(function(algorithm) {

  var Shifter = require('../lib/' + algorithm + '.js');

  var sh = new Shifter('dskijkfpie fweofi erghamsmcalwe');
  // var s = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
  var s = 'Able was I ere I saw Elba';
  
  process.stdout.write(algorithm + '=> ' + sh.encrypt(s));

  exports[algorithm +':changes'] = function(test) {
    test.notEqual(s, sh.encrypt(s));
    test.done();
  };

  exports[algorithm +':inverts'] = function(test) {
    test.equal(s, sh.decrypt(sh.encrypt(s)));
    test.done();
  };

});

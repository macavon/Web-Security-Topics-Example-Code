['shift-cipher', 'shift-cipher-stream'].forEach(function(algorithm) {

  var Shifter = require('../lib/' + algorithm + '.js');

  var sh = new Shifter(-145, 3);
  var s = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.';

  exports[algorithm +':changes'] = function(test) {
    test.notEqual(s, sh.encrypt(s));
    test.done();
  };

  exports[algorithm +':inverts'] = function(test) {
    test.equal(s, sh.decrypt(sh.encrypt(s)));
    test.done();
  };

});

var sc;

exports['idempotent shift throws exception'] = function(test){
  test.throws(function() { sc = require('../lib/shift-cipher.js').create(95);}, 'invalidArgument');
  test.done();
}
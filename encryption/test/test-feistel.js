util = require('util');


var Feistel = require('../lib/feistel.js');

var f = new Feistel(99, 5,
  function(k, n) {
    var a = [];
    for (var i=0; i < n; i++) {
      a.push((k + i)&0xef);
    };
    return a;
  },
  function(sk, x){
    return x.map(function(xi){ return (((xi&0xf)<<4)^((xi&0xf0)>>4))&sk; });
  });

var s = 'Able was I ere I saw Elba';

exports[':does not crash'] = function(test) {
  test.doesNotThrow(function() { return f.decrypt(f.encrypt(s)); });
  test.done();
};

exports[':changes'] = function(test) {
  test.notEqual(s, f.encrypt(s));
  test.done();
};

exports[':inverts'] = function(test) {
  test.equal(s, f.decrypt(f.encrypt(s)).trimRight());
  test.done();
};

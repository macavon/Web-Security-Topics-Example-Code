var Feistel = require('../lib/feistel.js');

var s = 'Able was I ere I saw Elba';

for (var i=1; i < 8; i++) {
  var f = new Feistel(1, i,
    function(k, n) {
      var a = [];
      for (var i=0; i < n; i++) {
        a.push((k + i)&0xef);
      }
      return a;
    },
    function(sk, x){
      return x.map(function(xi){ return (((xi&0xf)<<4)^
                                         ((xi&0xf0)>>4))&sk; });
    });

  process.stdout.write(i + ': ' + f.encrypt(s).replace(/\s/g, '+')+'\n');
}

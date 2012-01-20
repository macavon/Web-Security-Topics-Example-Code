require('./extensions.js');
var a = [1, 2, 3];
var b = [1, 11, 111];

exports['valid argument'] = function(test) {
  test.doesNotThrow(function() { a.zip(b); });
  test.equal(a.length, a.zip(b).length);
  test.deepEqual(a.zip(b), [[1, 1], [2, 11], [3, 111]]);
  test.deepEqual(a.zip(b, function(x, y) { return x + y; }), [2,13, 114]);
  test.done();
};

exports['invalid argument'] = function(test) {
  test['throws'](function() { [1, 2, 3].zip([11, 12]); }, 'invalidArgument');
  test.done();
};

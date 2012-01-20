require('./extensions.js');
var a = [[1, 2, 3], [11, 12, 13], [111, 112, 113], [1111, 1112, 1113]];
var b = [[1, 11, 111,1111], [2, 12, 112, 1112], [3, 13, 113, 1113]];

exports['valid argument'] = function(test) {
  test.doesNotThrow(function() { a.transpose(); });
  test.deepEqual(a.transpose(), b);
  test.done();
};

exports['invalid argument'] = function(test) {
  test['throws'](function() { [[1, 2, 3], [11, 12, 13], [111, 112, 113], [1111, 1112]].transpose(); }, 'invalidArgument');
  test['throws'](function() { [[1, 2, 3], 11, 12, 13, [111, 112, 113], [1111, 1112]].transpose(); }, 'invalidArgument');
  test.done();
};

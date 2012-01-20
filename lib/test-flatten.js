require('./extensions.js');

var a = [[1, 2], [3, 4], 99];

exports['flattens it'] = function(test) {
  test.deepEqual([1, 2, 3, 4, 99], a.flatten());
  test.done();
};
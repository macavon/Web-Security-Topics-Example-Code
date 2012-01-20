require('./extensions.js');

exports['pad tests'] = function(test) {
  test.equal('ab'.padRight(5), 'ab   ');
  test.equal('ab'.padRight(5, '+'), 'ab+++');
  test.equal('abcdef'.padRight(2), 'abcdef');
  test.done();
};
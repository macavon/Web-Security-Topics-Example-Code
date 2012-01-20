require('./extensions.js');

exports['valid argument'] = function(test) {
  test.equal(65, 'A'.ord());
  test.doesNotThrow(function() { 'a'.ord(); });
  test.done();
};

exports['invalid argument'] = function(test) {
  test['throws'](function() { 'abc'.ord(); }, 'invalidArgument');
  // test.doesThrow(function() { 'abc'.ord(); }, 'invalidArgument');
  test.done();
};

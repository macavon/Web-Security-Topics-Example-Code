require('./extensions.js');

exports['camel-casing tests'] = function(test) {
  test.equal('abcd'.camelCase(), 'abcd');
  test.equal('ab_cd'.camelCase(), 'abCd');
  test.equal('ab_cd_ef'.camelCase(), 'abCdEf');
  test.done();
};
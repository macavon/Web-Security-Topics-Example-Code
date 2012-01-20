require(__dirname+'/../../lib/extensions');

var OFFSET = ' '.ord();
var alpha_ord = function(c) {
  return c.ord() - OFFSET;
};
var ALPHABET_LENGTH = alpha_ord('~') + 1;

var alpha_char= function(n) {
  return (n + OFFSET).toChar();
};
var Shifter = function(sv){
	var ssv = sv.mod(ALPHABET_LENGTH);
  if (ssv == 0)
    throw {
      name: 'invalidArgument',
      message: 'shift value would not modify the input'
    };
  this._shift_value = ssv;
}

Shifter.prototype.encrypt = function(s) {
	var self = this;
  return s.map(function(c) {
    return alpha_char((alpha_ord(c) +
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

Shifter.prototype.decrypt = function(s) {
	var self = this;
  return s.map(function(c) {
    return alpha_char((alpha_ord(c) -
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

module.exports = Shifter;

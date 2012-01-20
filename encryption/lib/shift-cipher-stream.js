require(__dirname+'/../../lib/extensions');

var OFFSET = ' '.ord();

var alpha_ord = function(c) {
  return c.ord() - OFFSET;
};

var ALPHABET_LENGTH = alpha_ord('~') + 1;

var alpha_char= function(n) {
  return (n + OFFSET).toChar();
};

var Shifter = function(sv, iv){
  this._start_value = sv;
	this._increment = iv;
}  
  
Shifter.prototype._shift_up = function() {
  this._shift_value = (this._shift_value +
    this._increment).mod(ALPHABET_LENGTH);
}

Shifter.prototype.encrypt = function(s) {
	var self = this;
  this._shift_value = this._start_value;
  return s.map(function(c) {
    self._shift_up();
    return alpha_char((alpha_ord(c) +
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

Shifter.prototype.decrypt = function(s) {
	var self = this;
  this._shift_value = this._start_value;
  return s.map(function(c) {
    self._shift_up();
    return alpha_char((alpha_ord(c) -
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

module.exports = Shifter;

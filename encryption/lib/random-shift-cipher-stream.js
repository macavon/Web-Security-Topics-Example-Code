require(__dirname+'/../../lib/extensions');

var OFFSET = ' '.ord();

var alpha_ord = function(c) {
  return c.ord() - OFFSET;
};

var ALPHABET_LENGTH = alpha_ord('~') + 1;

var alpha_char= function(n) {
  return (n + OFFSET).toChar();
};

var Shifter = function(ks){
  this._key_stream = ks;
}

Shifter.prototype._shift_up = function() {
  this._shift_value = (this._key_stream[this._index].ord()).
                      mod(ALPHABET_LENGTH);
  this._index = (this._index + 1)%this._key_stream.length;
};
  
Shifter.prototype.encrypt = function(s) {
	var self = this;
  self._index = 0;
  return s.map(function(c) {
    self._shift_up();
    return alpha_char((alpha_ord(c) +
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

Shifter.prototype.decrypt = function(s) {
	var self = this;
  self._index = 0;
  return s.map(function(c) {
    self._shift_up();
    return alpha_char((alpha_ord(c) -
      self._shift_value).mod(ALPHABET_LENGTH));
  });
}

module.exports = Shifter;

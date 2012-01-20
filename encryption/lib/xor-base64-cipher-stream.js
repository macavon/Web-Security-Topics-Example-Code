require(__dirname+'/../../lib/extensions');

var Shifter = function(ks){
  this._key_stream = ks;
}  

Shifter.prototype._crypt1= function() {
	var self = this;
	return function(c) {
	  self._shift_up();
	  return (c.ord()^self._shift_value).toChar();
	}
}

Shifter.prototype._shift_up = function() {
  this._shift_value = (this._key_stream[this._index].ord());
  this._index = (this._index + 1)%this._key_stream.length;
};

Shifter.prototype.encrypt = function(s) {
	var self = this;
  self._index = 0;
  return s.map(self._crypt1()).base64Encode();
}

Shifter.prototype.decrypt = function(s) {
	var self = this;
  self._index = 0;
  return s.base64Decode().map(self._crypt1());
}

module.exports = Shifter;
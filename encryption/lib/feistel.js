require(__dirname+'/../../lib/extensions');

var BLOCKSIZE = 8;

var Feistel = function(key, number_of_rounds,
                          sub_key_generator,
                          round_function){
	this._number_of_rounds = number_of_rounds;
	this._round_function = round_function;
  this._forward_sub_keys = sub_key_generator(key,
                               number_of_rounds);
  this._reverse_sub_keys = sub_key_generator(key,
                               number_of_rounds).reverse();
}
  
Feistel.prototype._crypt = function(s, sub_keys) {
	var self = this;
  var blocks = function() {
    var block_count = Math.floor((s.length-1)/BLOCKSIZE)+1;
    var a = s.padRight(block_count*BLOCKSIZE).split('').
              map(function(x) { return x.ord(); });
    var bs = [];
    for (var i=0; i < a.length/BLOCKSIZE; i++) {
      bs[i] = a.slice(i*BLOCKSIZE, (i+1)*BLOCKSIZE);
    }
    return bs;
  }
  
  var crypt_a_block = function(b) {
    var left = b.slice(0, BLOCKSIZE/2);
    var right = b.slice(BLOCKSIZE/2, BLOCKSIZE);
    for (var i=0; i < self._number_of_rounds; i++) {
     var ki = sub_keys[i];
     var l = right;
     var t = self._round_function(ki, right);
     var r = t.zip(left,
                   function(t0, t1){ return t0 ^ t1; });
     left= l;
     right = r;
    }
    return right.concat(left);
  }
      
  return blocks().map(crypt_a_block).
    flatten().map(function(x) {
      return x.toChar(); }).join('');
}

Feistel.prototype.encrypt = function(s){
  return this._crypt(s, this._forward_sub_keys);
}

Feistel.prototype.decrypt = function(s){
  return this._crypt(s, this._reverse_sub_keys);
}    

module.exports = Feistel;

require(__dirname+'/../../lib/extensions');

var Transposition = function(code_word){
  this._keys = code_word.split('');
  this._sorted_keys = this._keys.sort();
}  

Transposition.prototype.encrypt = function(s) {
  var ss = s.replace(/\s/g, '').toUpperCase();
  var columns = [];
  var i = 0;
  for (var j=0; j < ss.length; j++) {
    columns[this._keys[i]] =(columns[this._keys[i]]||'') +  ss[j];
    i = (i + 1)%this._keys.length;
  }
  var ciphertext = '';
  this._sorted_keys.forEach(function(k) {
    ciphertext += columns[k];
  });
  return ciphertext;
}

Transposition.prototype.decrypt = function(s) {
  var column_length = s.length/this._keys.length;
  var columns = [];
  var offset = 0;
  for (var i=0; i < this._keys.length; i++) {
    columns[this._keys.indexOf(this._sorted_keys[i])] =
      s.slice(offset, offset + column_length).split('');
    offset += column_length;
  }
  return columns.transpose().map(
    function(c){ return c.join(''); }).join('');
}

module.exports = Transposition;
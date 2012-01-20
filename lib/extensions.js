util = require('util');

// some useful functions

var identity = function(x) {
  return x;
};

var pair = function(a, b){
  return [a, b];
};

var isArray = function(a) {
  // from Crockford's book, p 61
  return a && typeof a === 'object' && a.constructor === Array;
};


// Array extensions

Array.prototype.transpose = function() {
  var t = [], n = this.length;
  var m = 0;
  for (var i=0; i < n; i++) {
    var col = this[i];
    if (!isArray(col)) { throw {
      name: 'invalidArgument',
      message: 'transpose method can only be applied to arrays of arrays'
    };}
    if (m == 0) {
      m = col.length;
    }
    else {
      if (m != col.length) {throw {
        name: 'invalidArgument',
        message: 'transpose method can only be applied to arrays of arrays all the same length'
      };}
    }
  }
  for (i=0; i < m; i++) {
    t[i] = [];
    for (var j=0; j < n; j++) {
      t[i][j] = this[j][i];
    }
  }
  return t;
};

Array.prototype.zip = function(a, f) {
  var combine = f || pair;
  if (this.length != a.length) {
    throw {
      name: 'invalidArgument',
      message: 'zip method can only be applied to an array of the same length as its receiver'
    };
  }
  var z = [];
  for (var i=0; i < this.length; i++) {
    z[i] = combine(this[i], a[i]);
  }
  return z;
};

Array.prototype.flatten = function() {
  var flattenIt = function(el) {
    return isArray(el)? el.flatten(): el;
  }
  return this.reduce(function(f, el, i, a) { return f.concat(flattenIt(el)); }, []);
};

// String extensions

String.prototype.map = function(f) {
  return (this.split('').map(function(c, i, s) { return f(c); })).join('');
};

String.prototype.ord = function(){
  if (this.length != 1) { throw {
    name: 'invalidArgument',
    message: 'ord method can only be applied to strings of length 1'
  }; }
  return this.charCodeAt(0);
};

String.prototype.base64Encode = function() {
  return (new Buffer(this.valueOf())).toString('base64');
};

String.prototype.base64Decode = function() {
  return (new Buffer(this.valueOf(), 'base64')).toString();
};

String.prototype.padRight = function(n, c) {
  var len = this.length;
  ch = c || ' ';
  if (n <= len) {
    return this;
  }
  else {
    var s = this;
    for (var i=0; i < n - len; i++) {
      s += ch;
    }
  return s;
  }
};

String.prototype.camelCase = function() {
	return this.replace(/([a-z])_([a-z])/g, function(ss, c1, c2) { return c1 + c2.toUpperCase(); });
};

// Number extensions

Number.prototype.toChar = function() {
  return String.fromCharCode(this);
};

Number.prototype.mod =function(d) {
  var rem = this%d;
  return rem < 0? d+rem: rem;
};

module.exports = {
  wrap: function(fn, prop) {
    return function(req, res, next) {
      fn(req[prop], next);
    }
  }
}

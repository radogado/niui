module.exports = start;

function start (len, each, callback) {
  if (len == 0) return callback();

  (function loop (i) {
    each(next, i);

    function next (error) {
      if (error) return callback(error);
      if (i + 1 == len) return callback();

      loop(i + 1);
    }
  }(0));
}

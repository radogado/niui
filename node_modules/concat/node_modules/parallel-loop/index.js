module.exports = parallel;

function parallel (n, each, done) {
  if (n == 0) return done();

  var counter = 0;
  var i = -1;

  while (++i < n) {
    call(i);
  }

  function call (i) {
    var unlock = true;

    each(function () {
      if (!unlock) return;
      unlock = undefined;

      if (++counter == n) done();
    }, i);
  }
}

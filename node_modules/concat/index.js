var loop = require("serial-loop");
var fs = require("fs");

module.exports = concat;

function concat (files, dest, callback) {
  fs.writeFile(dest, '', function (error) {
    if (error) return callback(error);

    loop(files.length, each, callback);

    function each (done, i) {
      fs.readFile(files[i], function (error, buffer) {
        if (error) return done(error);

        fs.appendFile(dest, buffer, done);
      });
    }

  });

}

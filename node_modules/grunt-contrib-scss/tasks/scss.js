'use strict';
var sass = require('node-sass');
var async = require('async');
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  grunt.registerMultiTask('scss', 'Compile SCSS to CSS', function () {
    var options = this.options({
      includePaths: [],
      outputStyle: 'nested',
      sourceComments: 'none'
    });

    async.eachSeries(this.files, function (el, next) {
      var scss = '';
      for (var i = 0; i < el.src.length; i++) {
        var src = el.src[i];
        if (path.basename(src)[0] === '_') {
          continue;
        }
        scss += fs.readFileSync(src);
      }

      if (scss.length === 0) return next();

      var sassConfig = {
        data: scss,
        success: function (css) {
          grunt.file.write(el.dest, css);
          grunt.log.writeln('File "' + el.dest + '" created.');
          next();
        },
        error: function (err) {
          grunt.warn(err);
        },
        includePaths: options.includePaths,
        outputStyle: options.outputStyle,
        sourceComments: options.sourceComments
      };

      sass.render(sassConfig);
    }, this.async());
  });
};
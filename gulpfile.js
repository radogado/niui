// Grab our gulp packages
var concat = require('gulp-concat'),
	gulp = require('gulp'),
	merge = require('merge-stream'),
	rename = require('gulp-rename'),
	rollup = require('gulp-better-rollup'),
	sourcemaps = require('gulp-sourcemaps'),
	terser = require('gulp-terser'),
	headerfooter = require('gulp-headerfooter');

gulp.task('build:scripts', function() {
	return gulp.src(['js/niui-core.js', 'components/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(rollup({}, { format: 'cjs', strict: false, treeshake: false }))
		.pipe(concat('niui.js'))
		.pipe(headerfooter.header('js/niui-head.js'))
		.pipe(headerfooter.footer('js/niui-tail.js'))
		.pipe(terser())
		.pipe(rename(function(path) {
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write('.', {
			mapFile: function(mapFilePath) {
				return mapFilePath.replace('.js.map', '.map');
			}
		}))
		.pipe(gulp.dest('dist'));
});
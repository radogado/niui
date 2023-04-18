// Grab our gulp packages
const concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css');
	gulp = require('gulp'),
	merge = require('merge-stream'),
	rename = require('gulp-rename'),
	rollup = require('gulp-better-rollup'),
	sourcemaps = require('gulp-sourcemaps'),
	terser = require('gulp-terser'),
	sassGlob = require('gulp-sass-glob'),
	size = require('gulp-size'),
	headerfooter = require('gulp-headerfooter');

const { sass } = require("@mr-hope/gulp-sass");

gulp.task('build:styles', function () {
	return gulp.src(['components/**/*.scss', 'css/niui-core.scss'])
		.pipe(sassGlob())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('niui.css'))
		.pipe(cleanCSS())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write('.', {
			mapFile: function (mapFilePath) {
				return mapFilePath.replace('.css.map', '.css.map');
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:styles_wp', function () {
	return gulp.src(['components/**/*.scss', 'css/niui-core.scss', 'css/niui-wp.scss'])
		.pipe(sassGlob())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('niui-wp.css'))
		.pipe(cleanCSS())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write('.', {
			mapFile: function (mapFilePath) {
				return mapFilePath.replace('.css.map', '.css.map');
			}
		}))
		.pipe(gulp.dest('niui-wp'));
});

gulp.task('build:script_module', function() {
	return gulp.src(['components/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(rollup({}, { format: 'es', strict: false}))
		.pipe(concat('niui.js'))
		.pipe(headerfooter.header('js/niui-core.js'))
		.pipe(headerfooter.footer('js/niui-tail.js'))
		.pipe(sourcemaps.write('.', {
			mapFile: function(mapFilePath) {
				return mapFilePath.replace('.js.map', '.js.map');
			}
		}))
		.pipe(gulp.dest('js'));
});

gulp.task('build:script_min', function() {
		
		return gulp.src(['js/niui.js'])
		.pipe(sourcemaps.init())
		.pipe(rollup({}, { format: 'es', strict: false}))
		.pipe(headerfooter.footer(';window.nui = nui;'))
		.pipe(terser())
		.pipe(rename(function(path) {
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write('.', {
			mapFile: function(mapFilePath) {
				return mapFilePath.replace('.js.map', '.js.map');
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('size:css', function () {
	return gulp.src(['./dist/niui.min.css'])
		.pipe(size({gzip: true, title: 'CSS', showFiles: true}))
		.pipe(gulp.dest('dist'));
});

gulp.task('size:js', function () {
	return gulp.src(['./dist/niui.min.js'])
		.pipe(size({gzip: true, title: 'JS', showFiles: true}))
		.pipe(gulp.dest('dist'));
});


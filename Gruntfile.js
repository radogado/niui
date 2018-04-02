module.exports = function(grunt) {

	grunt.initConfig({
		'sass': {
			dist: { 
				files: {
					'src/css/natuive.css': 'src/css/natuive.scss',
					'src/css/natuive-wordpress.css': 'src/css/natuive-wordpress.scss'
					}
				}
		},
		'cssmin': {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1
		  },
		  target: {
		    files: {
		      'dist/natuive.min.css': ['src/css/natuive.css'],
		      'natuive-wordpress/natuive-wordpress.min.css': ['src/css/natuive-wordpress.css']
		    }
		  }
		},
		'concat': {
			js: {
			    options: {
		      separator: ';',
		      banner: 'var nui = (function(){',
		      footer: 'return { init: init, animate: animate, copyButton: copyButton, openFullWindow: openFullWindow, closeFullWindow: closeFullWindow, notify: notify, addComponent: addComponent, makeSlider: makeSlider }; })();'
		    },
		      src: ['src/script/natuive.js', 'src/script/natuive-slider.js'],
		      dest: 'src/script/natuive-combined.js',
		    }
		},
		'closure-compiler': {
			frontend: {
			  closurePath: './node_modules/closure-compiler',
			  js: ['src/script/natuive-combined.js'],
			  jsOutputFile: 'dist/natuive.min.js',
			  maxBuffer: 500,
			  noreport: true,
			  options: {
			    compilation_level: 'ADVANCED_OPTIMIZATIONS',
			    language_in: 'ECMASCRIPT5_STRICT',
			  }
			}
		},
		'copy': {
		  main: {
		    expand: true,
		    cwd: 'dist',
		    src: 'natuive.min.js',
		    dest: 'natuive-wordpress/',
		  }
		}  
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'cssmin', 'concat', 'closure-compiler', 'copy']);

};

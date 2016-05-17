module.exports = function(grunt) {

	grunt.initConfig({ /* To do: compile SCSS first */
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
	  'closure-compiler': {
	    frontend: {
	      closurePath: './node_modules/closure-compiler',
	      js: ['src/script/natuive.js', 'src/script/natuive-slider.js', 'src/script/natuive-fallback.js'],
	      jsOutputFile: 'dist/natuive.min.js',
	      maxBuffer: 500,
		  noreport: true,
	      options: {
	        compilation_level: 'ADVANCED_OPTIMIZATIONS',
	        language_in: 'ECMASCRIPT5_STRICT',
	      }
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-closure-compiler');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'cssmin', 'closure-compiler']);

};

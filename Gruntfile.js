module.exports = function(grunt) {

	grunt.initConfig({ /* To do: compile SCSS first */
		'sass': { 
			dist: { 
				files: { 'include/natuive.css': 'include/natuive.scss' } 
				} 
		},
		'cssmin': {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1
		  },
		  target: {
		    files: {
		      'dist/natuive.min.css': ['include/natuive.css']
		    }
		  }
		},
	  'closure-compiler': {
	    frontend: {
	      closurePath: './node_modules/closure-compiler',
	      js: ['include/natuive.js', 'include/natuive-slider.js', 'include/natuive-fallback.js'],
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

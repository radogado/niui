module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.initConfig({
		'sass': {
			core: { 
				files: {
					'src/css/natuive-core.css': 'src/css/natuive-core.scss'
					}
				},
			components: {
				files: [{
					expand: true,
						cwd: "src/components",
						src: ["**/*.scss"],
						dest: "src/components",
						ext: ".css"
					}]
				},
			WordPress: {
				files: {
					'src/css/natuive-wordpress.css': 'src/css/natuive-wordpress.scss'
					}
				}
		},
		'concat': {
		  JS: {
			options: {
				separator: ';',
				banner: 'var nui = (function(){',
				footer: 'initComponents(); return { initComponents: initComponents, animate: animate, copyButton: copyButton, notify: notify, addComponent: addComponent }; })();'
		    },
		    src: ['src/script/natuive-core.js', 'src/components/**/*.js'],
		    dest: 'src/script/natuive.js'
		  },
		  CSS: {
		    src: ['src/css/natuive-core.css', 'src/components/**/*.css'],
		    dest: 'src/css/natuive.css'
		  },
		  JS_lite: {
			options: {
				separator: ';',
				banner: 'var nui = (function(){',
				footer: 'initComponents(); return { initComponents: initComponents, animate: animate, copyButton: copyButton, notify: notify, addComponent: addComponent }; })();'
		    },
		    src: ['src/script/natuive-core.js', 'src/components/form/*.js', 'src/components/nav/*.js', 'src/components/table/*.js', 'src/components/tooltip/*.js'],
		    dest: 'src/script/natuive-lite.js'
		  },
		  CSS_lite: {
		    src: ['src/css/natuive-core.css', 'src/components/button/*.css', 'src/components/form/*.css', 'src/components/grid/*.css', 'src/components/list/*.css', 'src/components/nav/*.css', 'src/components/table/*.css', 'src/components/tooltip/*.css', 'src/components/typography/*.css'],
		    dest: 'src/css/natuive-lite.css'
		  },
		  WordPress: {
		    src: ['src/css/natuive.css', 'src/css/natuive-wordpress.css'],
		    dest: 'src/css/natuive-wordpress-bundle.css'
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
			      'dist/natuive-lite.min.css': ['src/css/natuive-lite.css'],
			      'natuive-wordpress/natuive-wordpress.min.css': ['src/css/natuive-wordpress-bundle.css']
			    }
			  }
		},
		'closure-compiler': {
			dist: {
			  closurePath: './node_modules/closure-compiler',
			  js: 'src/script/natuive.js',
			  jsOutputFile: 'dist/natuive.min.js',
			  maxBuffer: 500,
			  noreport: true,
			  options: {
			    compilation_level: 'ADVANCED_OPTIMIZATIONS',
			    language_in: 'ECMASCRIPT5_STRICT',
			  }
			},
			lite: {
			  closurePath: './node_modules/closure-compiler',
			  js: 'src/script/natuive-lite.js',
			  jsOutputFile: 'dist/natuive-lite.min.js',
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

	grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'closure-compiler', 'copy']);

};

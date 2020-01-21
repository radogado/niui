module.exports = function(grunt) {

/*
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-gzip');
	grunt.loadNpmTasks('grunt-contrib-watch');
*/

	require('jit-grunt')(grunt);

	grunt.initConfig({
		'sass': {
			core: { 
					options: {
						sourcemap: false
					},
    				files: {
					'src/css/natuive-core.css': 'src/css/natuive-core.scss'
					}
				},
			components: {
				options: {
					sourcemap: false
				},
				files: [{
					expand: true,
						cwd: "src/components",
						src: ["**/*.scss"],
						dest: "src/components",
						ext: ".css"
					}]
				},
			WordPress: {
				options: {
					sourcemap: false
				},
				files: {
					'src/css/natuive-wordpress.css': 'src/css/natuive-wordpress.scss'
					}
				}
		},
		'concat': {
		  JS: {
			options: {
				separator: ';',
				banner: 'window.nui = (() => {', // skirt non-ES6 browsers like IE11
				footer: 'initComponents(); return { initComponents, animate, copyButton, componentModal, addComponent, componentSlider, componentNotify } })();'
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
				banner: 'window.nui = (() => {', // skirt non-ES6 browsers like IE11
				footer: 'initComponents(); return { initComponents, animate, copyButton, addComponent } })();'
		    },
		    src: ['src/script/natuive-core.js', 'src/components/**/*.js', '!src/components/lightbox/*', '!src/components/slider/*', '!src/components/grid-inline-popups/*' ,'!src/components/parallax/*','!src/components/notify/*','!src/components/modal/*','!src/components/fold/*', '!src/components/tooltip/*'],
		    dest: 'src/script/natuive-lite.js'
		  },
		  CSS_lite: {
		    src: ['src/css/natuive-core.css', 'src/components/**/*.css', '!src/components/lightbox/*', '!src/components/slider/*', '!src/components/grid-inline-popups/*' ,'!src/components/parallax/*','!src/components/notify/*','!src/components/modal/*','!src/components/fold/*', '!src/components/tooltip/*'],
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
			      'natuive-wp/natuive-wordpress.min.css': ['src/css/natuive-wordpress-bundle.css']
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
			    compilation_level: 'SIMPLE_OPTIMIZATIONS',
			    language_in: 'ECMASCRIPT6_STRICT',
			    language_out: 'ECMASCRIPT_2015',
			  }
			},
			lite: {
			  closurePath: './node_modules/closure-compiler',
			  js: 'src/script/natuive-lite.js',
			  jsOutputFile: 'dist/natuive-lite.min.js',
			  maxBuffer: 500,
			  noreport: true,
			  options: {
			    compilation_level: 'SIMPLE_OPTIMIZATIONS',
			    language_in: 'ECMASCRIPT6_STRICT',
			    jscomp_off: 'checkVars'
			  }
			}
		},
		'copy': {
		  WP: {
		    expand: true,
		    cwd: 'dist',
		    src: ['natuive.min.js'],
		    dest: 'natuive-wp/',
		  }
		},
		'gzip': {
		    options: { detail: false },
		    index: {
		      src: [
		        'dist/natuive.min.css'
		      ]
		    }
		  },
		'watch': {
		  scripts: {
		    files: ['src/components/**/*.js', 'src/components/**/*.scss'],
		    tasks: ['dev'],
		    options: {
		      spawn: false,
		    },
		  },
		}		  
	});

	grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'gzip', 'closure-compiler', 'copy']);
	grunt.registerTask('dev', ['sass', 'concat', 'cssmin', 'copy', 'gzip']);

};

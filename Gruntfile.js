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
					'src/css/niui-core.css': 'src/css/niui-core.scss'
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
					'src/css/niui-wordpress.css': 'src/css/niui-wordpress.scss'
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
		    src: ['src/script/niui-core.js', 'src/components/**/*.js'],
		    dest: 'src/script/niui.js'
		  },
		  CSS: {
		    src: ['src/css/niui-core.css', 'src/components/**/*.css'],
		    dest: 'src/css/niui.css'
		  },
		  JS_lite: {
			options: {
				separator: ';',
				banner: 'window.nui = (() => {', // skirt non-ES6 browsers like IE11
				footer: 'initComponents(); return { initComponents, animate, copyButton, addComponent } })();'
		    },
		    src: ['src/script/niui-core.js', 'src/components/**/*.js', '!src/components/lightbox/*', '!src/components/slider/*', '!src/components/grid-inline-popups/*' ,'!src/components/parallax/*','!src/components/notify/*','!src/components/modal/*','!src/components/fold/*', '!src/components/tooltip/*'],
		    dest: 'src/script/niui-lite.js'
		  },
		  CSS_lite: {
		    src: ['src/css/niui-core.css', 'src/components/**/*.css', '!src/components/lightbox/*', '!src/components/slider/*', '!src/components/grid-inline-popups/*' ,'!src/components/parallax/*','!src/components/notify/*','!src/components/modal/*','!src/components/fold/*', '!src/components/tooltip/*'],
		    dest: 'src/css/niui-lite.css'
		  },
		  WordPress: {
		    src: ['src/css/niui.css', 'src/css/niui-wordpress.css'],
		    dest: 'src/css/niui-wordpress-bundle.css'
		  }
		},
		'cssmin': {
			  options: {
			    shorthandCompacting: false,
			    roundingPrecision: -1
			  },
			  target: {
			    files: {
			      'dist/niui.min.css': ['src/css/niui.css'],
			      'dist/niui-lite.min.css': ['src/css/niui-lite.css'],
			      'niui-wp/niui-wordpress.min.css': ['src/css/niui-wordpress-bundle.css']
			    }
			  }
		},
		'closure-compiler': {
			dist: {
			  closurePath: './node_modules/closure-compiler',
			  js: 'src/script/niui.js',
			  jsOutputFile: 'dist/niui.min.js',
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
			  js: 'src/script/niui-lite.js',
			  jsOutputFile: 'dist/niui-lite.min.js',
			  maxBuffer: 500,
			  noreport: true,
			  options: {
			    compilation_level: 'SIMPLE_OPTIMIZATIONS',
			    language_in: 'ECMASCRIPT6_STRICT',
			    jscomp_off: 'checkVars'
			  }
			}
		},
		'terser': {
		  options: {
			  ecma: '2015'
		  },
		  main: {
		    files: {
		      './dist/niui.min.js': ['./src/script/niui.js'],
		      './dist/niui-lite.min.js': ['./src/script/niui-lite.js'],
		    }
		  }
		},
  		'copy': {
		  WP: {
		    expand: true,
		    cwd: 'dist',
		    src: ['niui.min.js'],
		    dest: 'niui-wp/',
		  }
		},
		'gzip': {
		    options: { detail: false },
		    css: {
		      src: [
		        'dist/niui.min.css'
		      ]
		    },
		    js: {
		      src: [
		        'dist/niui.min.js'
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

	grunt.registerTask('default', ['sass', 'concat', 'cssmin', /* 'closure-compiler', */ 'terser', 'gzip', 'copy']);
	grunt.registerTask('dev', ['sass', 'concat', 'cssmin', 'copy', 'gzip']);

};

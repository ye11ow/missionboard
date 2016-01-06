module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/bundle.js',
        dest: 'demo/js/bundle.js'
      },
      background: {
        src: 'js/background.js',
        dest: 'demo/js/background.js'
      }
    },
    copy: {
      manifest: {
        expand: true,
        src: 'manifest.json',
        dest: 'build/',
        flatten: false,
        filter: 'isFile',
      },
      font: {
        expand: true,
        cwd: 'node_modules/font-awesome/fonts',
        src: 'fontawesome-webfont.woff2',
        dest: 'build/fonts',
        flatten: false,
        filter: 'isFile',
      },
      html: {
        expand: true,
        cwd: 'src',
        src: 'index.html',
        dest: 'build',
        flatten: false,
        filter: 'isFile',
      },
      images: {
        expand: true,
        cwd: 'img',
        src: '**',
        dest: 'build/img',
        flatten: false,
        filter: 'isFile',
      },
      locales: {
        expand: true,
        cwd: 'src/_locales',
        src: '**',
        dest: 'build/_locales',
        flatten: false,
        filter: 'isFile',
      }
    },
    less: {
      production: {
        options: {
            compress: true
        },
        files: {
          "build/css/static.css": "src/less/static.less",
          "build/css/bundle.css": "src/less/bundle.less"
        }
      }
    },
    clean: ["demo"],
    compress: {
      main: {
        options: {
          archive: 'dist/latest.zip'
        },
        files: [
          {src: ['build/**'], dest: '/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'less', 'copy']);
  grunt.registerTask('dist', ['build', 'compress']);

};
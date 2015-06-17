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
        dest: 'demo/',
        flatten: false,
        filter: 'isFile',
      },
      css: {
        expand: true,
        cwd: 'css/',
        src: '**',
        dest: 'demo/css',
        flatten: false,
        filter: 'isFile',
      },
      font: {
        expand: true,
        cwd: 'node_modules/font-awesome/fonts',
        src: 'fontawesome-webfont.woff2',
        dest: 'demo/fonts',
        flatten: false,
        filter: 'isFile',
      },
      index: {
        expand: true,
        src: 'index.html',
        dest: 'demo/',
        flatten: false,
        filter: 'isFile',
      },
      jslib: {
        expand: true,
        cwd: 'js/libs',
        src: '**',
        dest: 'demo/js/libs',
        flatten: false,
        filter: 'isFile',
      },
      images: {
        expand: true,
        cwd: 'img',
        src: '**',
        dest: 'demo/img',
        flatten: false,
        filter: 'isFile',
      },
      locales: {
        expand: true,
        cwd: '_locales',
        src: '**',
        dest: 'demo/_locales',
        flatten: false,
        filter: 'isFile',
      },
      devFont: {
        expand: true,
        cwd: 'node_modules/font-awesome/fonts',
        src: 'fontawesome-webfont.woff2',
        dest: 'fonts',
        flatten: false,
        filter: 'isFile',
      }
    },
    clean: ["demo"],
    compress: {
      main: {
        options: {
          archive: 'dist/latest.zip'
        },
        files: [
          {src: ['demo/**'], dest: '/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['copy:devFont']);
  grunt.registerTask('build', ['clean', 'uglify', 'copy', 'compress']);

};
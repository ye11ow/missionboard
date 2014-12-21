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
      }
    },
    copy: {
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
        cwd: 'fonts/',
        src: '**',
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
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('buildDemo', ['uglify', 'copy']);

};
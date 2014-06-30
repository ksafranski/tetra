module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({

    // Get package JSON
    pkg: grunt.file.readJSON('package.json'),
    
    // JSBeatuify
    jsbeautifier: {
      server: {
        src: ['index.js', 'libs/**/*.js', 'adapters/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },

    // JSHint
    jshint: {
      server: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: ['index.js', 'libs/**/*.js', 'adapters/**/*.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [ 'jsbeautifier', 'jshint' ]);

};
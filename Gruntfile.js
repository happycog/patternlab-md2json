/*
 * patternlab-md2json
 * https://github.com/dandelauro/patternlab-md2json
 *
 * Copyright (c) 2015 Dan DeLauro
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      annotations: ["tmp/annotations.js"]
    },

    patternlab_md2json: {
        annotations: {
            options: {
                minify: false,
                width: 60
            },
            files: {
                'tmp/annotations.js': ['fixtures/*.md']
            },
        }
    }

  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['clean', 'jshint', 'patternlab_md2json']);

};

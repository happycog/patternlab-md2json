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
          width: 60,
          html: {
            'template': 'templates/annotations.html',
            'outfile': 'tmp/annotations.html',
            'meta': {
              'title': 'Annotations',
              'header': 'Annotations',
              'intro': 'Introductory text...'
            },
            'patterns': ['atoms', 'molecules', 'organisms', 'templates', 'pages'],
            'docFileSuffix': '-extra'
          }
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
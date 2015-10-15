/*
 * patternlab-md2json
 * https://github.com/dandelauro/patternlab-md2json
 *
 * Copyright (c) 2015 Dan DeLauro
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var md2json = require('./lib/md2json.js');

  grunt.registerMultiTask('patternlab_md2json',
    'markdown -> html -> json', function() {

    var options = this.options({
      minify: false,
      width: 50,
      html: {
        'template': 'templates/annotations.html',
        'outfile': 'tmp/annotations.html',
        'meta': {
          'title': 'Annotations',
          'header': 'Annotations'
        }
      }
    });

    this.files.forEach(function(f) {
      options.outfile = f.dest;
      try {
        md2json.parse(f.src, options);
        grunt.log.ok('annotations file created at ' + options.outfile);
        if (options.html) {
          grunt.log.ok('annotations html file created at ' + options.html.outfile);
        }
      } catch(e) {
        grunt.log.error();
        grunt.verbose.error(e);
        grunt.fail.warn('annotations file not created. not sure what happened there...');
      }

    });

  });
};

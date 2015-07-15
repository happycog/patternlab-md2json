var path = require('path'),
    os = require('os'),
    fs = require('fs'),
    marked = require('marked'),
    _ = require('lodash');

exports.parse = function(files, options) {

    var annotations = [];

    _(files).each(function(file) {
      var text = parseText(file);
      var markdown = parseMarkdown(text);
      annotations = annotations.concat(markdown);
    });

    writeFile(annotations, options);

    function parseText(file) {

      var text = fs.readFileSync(file, 'utf8');
      var lines = text.split(os.EOL);
      var pre = "-- ";
      var annotations = [];
      var annotation = {
        'el': '',
        'title': '',
        'comment': ''
      };

      _(lines).each(function(line, i) {
          if (line.indexOf(pre) !== -1) {
            if (annotation.el && annotation.el !== '') {
              annotations.push(annotation);
            }
            entry = line.replace(pre, '').split(":");
            annotation[entry[0]] = entry[1];
            if (i == lines.length - 1) {
              annotations.push(annotation);
            }
          } else {
            annotation['comment'] = annotation.comment + line + "\n";
          }
      });

      return annotations;
    }


    function parseMarkdown(blocks) {

      _(blocks).each(function(block) {
          block.comment = marked(block.comment);
      });

      return blocks;
    }

    function writeFile(annotations, options) {

      var json;

      if (options.minify) {
          json = JSON.stringify(annotations);
      } else {
          json = JSON.stringify(annotations, null, 2) + "\n";
      }

      var content = "var comments = { \"comments\":" + json + "};";

      if (options.outfile) {
          var file = fs.openSync(options.outfile, 'w+');
          fs.writeSync(file, content);
          fs.closeSync(file);
          return;
      } else {
          return json;
      }

    }


}

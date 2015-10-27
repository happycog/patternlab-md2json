var path = require('path'),
    os = require('os'),
    fs = require('fs'),
    marked = require('marked'),
    mustache = require('mustache'),
    _ = require('lodash'),
    Entities = require('html-entities').AllHtmlEntities;

exports.parse = function(files, options, company) {

    init();

    function init() {
        writeJSON();
        if (options.html) {
            writeHTML();
        }
    }

    function annotate(files, type) {

        var annotated = [];
        _(files).each(function(file, ii) {
            if (type && type !== patternType(file)) {
                return;
            }
            var text = parseText(file, type, ii);
            if (text) {
                var markdown = parseMarkdown(text);
                annotated = annotated.concat(markdown);
            }
        });
        return annotated;
    }

    function patternType(path) {
        return path.slice(0, -3).split('/').slice(2)[0].split('-')[1]
    }

    function patternPath(path, type) {
        var rootPath = path.slice(0, -3).split('/').slice(2).join('-');
        var filePath = 'patterns/' + rootPath + '/' + rootPath;
        switch (type) {
            case 'html':
                path = filePath + '.html';
                break;
            case 'escaped.html':
                path = filePath + '.escaped.html';
                break;
            case 'mustache':
            default:
                path = filePath + '.mustache';
                break;
        }
        return path;
    }

    function patternCode(path, type) {
        switch (type) {
            case 'html':
                path.replace('.md', '.escaped.html')
                break;
            case 'docs':
                path.replace('.md', options.html.docFileSuffix + '.md')
                break;
            case 'mustache':
            default:
                path.replace('.md', '.mustache')
                break;
        }
        return fs.readFileSync('public/' + path, 'utf8');
    }

    function patternDocs(path, type) {
        return fs.readFileSync(path, 'utf8');
    }

    function parseText(file, type, ii) {

        if (fs.existsSync(file.replace(".md", '.mustache'))) {
            var docFile = file.replace(".md", options.html.docFileSuffix + ".md");
            var text = fs.readFileSync(file, 'utf8');
            var lines = text.split(os.EOL);
            var pre = "-- ";
            var annotations = [];
            var annotation = {};

            var annotationKeys = ['el', 'title', 'comment'];
            if (type) {
                annotationKeys.unshift('id', 'patternUrl', 'patternHtml', 'patternMustache', 'patternDocs');
            }
            _(annotationKeys).each(function(key) {
                annotation[key] = '';
            });

            var entities = new Entities();

            _(lines).each(function(line, i) {
                if (line.indexOf(pre) !== -1) {
                    if (annotation.el && annotation.el !== '') {
                        annotations.push(annotation);
                    }
                    entry = line.replace(pre, '').split(":");
                    annotation[entry[0]] = entry[1].trim();
                    if (i == lines.length - 1) {
                        annotations.push(annotation);
                    }
                } else {
                    annotation['comment'] = annotation.comment + line + "\n";
                }
            });

            if (type) {
                annotation['id'] = ii;
                annotation['patternUrl'] = patternPath(file, 'html');
                annotation['patternHtml'] = entities.decode(patternCode(patternPath(file, 'escaped.html'), 'html'));
                annotation['patternMustache'] = entities.decode(patternCode(patternPath(file)));

                if (fs.existsSync(docFile)) {
                    annotation['patternDocs'] = marked(patternDocs(docFile));
                }

            }

            return annotations;

        } else {
            return;
        }

    }


    function parseMarkdown(blocks) {

        _(blocks).each(function(block) {
            block.comment = marked(block.comment);
        });

        return blocks;
    }

    function writeHTML() {

        var json = {
            'meta': options.html.meta,
            'patterns': {}
        };

        _(options.html.patterns).each(function(type, i) {
            json['patterns'][type] = annotate(files, type);
        });

        var template = fs.readFileSync(options.html.template, 'utf8');
        var rendered = mustache.render(template, json);
        var file = fs.openSync(options.html.outfile, 'w+');
        fs.writeSync(file, rendered);
        fs.closeSync(file);

        var jsonFile = fs.openSync(options.html.outfile.replace('html', 'json'), 'w+');
        fs.writeSync(jsonFile, JSON.stringify(json));
        fs.closeSync(jsonFile);

        return;

    }

    function writeJSON() {

        var json, content, annotations, type = null;
        annotations = annotate(files, type);

        if (options.minify) {
            json = JSON.stringify(annotations);
        } else {
            json = JSON.stringify(annotations, null, 2) + "\n";
        }

        content = "var comments = { \"comments\":" + json + "};";

        if (options.outfile) {
            file = fs.openSync(options.outfile, 'w+');
            fs.writeSync(file, content);
            fs.closeSync(file);
            return;
        } else {
            return json;
        }

    }

}

# patternlab-md2json

a pretty simple grunt plugin that lets you write your pattern lab annotations in markdown. good times.

#### the install

`npm install patternlab-md2json --save-dev`

#### the markdown

__00-header.md__

```
-- el: header[role=banner]
-- title: Masthead

The main header of the site doesn't take up too much screen real estate in order to keep the focus on the core content. It's using a linear CSS gradient instead of a background image to give greater design flexibility and reduce HTTP requests.

```

__01-logo.md__

```
-- el: .logo
-- title: Logo

The logo image is an SVG file, which ensures that the logo displays crisply even on high resolution displays. A PNG fallback is provided for browsers that don't support SVG images.

Further reading: [Optimizing Web Experiences for High Resolution Screens](http://bradfrostweb.com/blog/mobile/hi-res-optimization/).

```

#### the js

__annotations.js__
```js
var comments = {
    "comments":[{
        "el": " header[role=banner]",
        "title": "Masthead",
        "comment": "<p>The main header of the site doesn&#39;t take up too much screen real estate in order to keep the focus on the core content. It&#39;s using a linear CSS gradient instead of a background image to give greater design flexibility and reduce HTTP requests.</p>\n"
    },
    {
        "el": " .logo",
        "title": "Logo",
        "comment": "<p>The logo image is an SVG file, which ensures that the logo displays crisply even on high resolution displays. A PNG fallback is provided for browsers that don&#39;t support SVG images.</p>\n<p>Further reading: <a href=\"http://bradfrostweb.com/blog/mobile/hi-res-optimization/\">Optimizing Web Experiences for High Resolution Screens</a>.</p>\n"
    }]
};
```

#### the grunt

__Gruntfile.js__
```js

grunt.initConfig({
    patternlab_md2json: {
        annotations: {
            options: {
                minify: false,
                width: 60
            },
            files: {
                'source/_data/annotations.js': ['path/to/annotations/**/*.md']
            },
        }
    }
});

grunt.loadNpmTasks('patternlab-md2json');

```

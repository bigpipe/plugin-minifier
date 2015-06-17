# BigPipe - Plugin Minifier

[![Version npm][version]](http://browsenpm.org/package/bigpipe-minifier)[![Build Status][build]](https://travis-ci.org/bigpipe/plugin-minifier)[![Dependencies][david]](https://david-dm.org/bigpipe/plugin-minifier)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/plugin-minifier?branch=master)

[version]: http://img.shields.io/npm/v/bigpipe-minifier.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/plugin-minifier/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/plugin-minifier.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/plugin-minifier/master.svg?style=flat-square

Minification plugin for the compiler. Currently, only `uglify-js` and `clean-css`
are supported. Additional minifiers can easily be added, PR's are welcomed.

### Install

To install the plugin with the default minification tools:

```bash
npm install bigpipe-minifier uglify-js clean-css --save
```

### Usage

The tools that are used for minification have to be passed specifically. This
module deliberatly does not ship all required modules. Either a JS or CSS
minifier can be passed, or both. The properties on the configuration object will
be passed as options to the minification tool. For example, `bare_returns` and
`screw_ie8` are passed as options to `uglify-js`.

```js
var minifier = require('bigpipe-minifier')
  , BigPipe = require('bigpipe');

BigPipe.createServer(8080, {
 minifier: {
    css: {
      name: 'clean-css',
      tool: require('clean-css')
    },
    js: {
      name: 'uglify-js',
      tool: require('uglify-js'),
      bare_returns: true,
      screw_ie8: true
    }
  },
  plugins: [ minifier ]
});
```

The plugin will capture any emitted `register` events from the compiler and
minify the file content just before it is saved to disk.

### License

MIT
'use strict';

function Minifier(options) {
  this.options = options || {};

  this.options.css = options.css || {};
  this.options.js = options.js || {};
}

Minifier.prototype.js = function js(file, done) {
  var options = this.options.js
    , content;

  switch(options.name) {
    case 'uglify-js':
    default:
      options.fromString = true;

      content = options.tool.minify(file.code, options);
      done(null, content.code);

      break;
  }
};

Minifier.prototype.css = function css(file, done) {
  var options = this.options.css;

  switch(options.name) {
    case 'clean-css':
    default:
      new options.tool(options).minify(file.code, function minified(error, content) {
        if (error) return done(error);
        done(null, content.styles);
      });

      break;
  }
};

//
// Export minifier.
//
module.exports = Minifier;
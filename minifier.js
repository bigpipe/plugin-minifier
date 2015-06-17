'use strict';

var debug = require('diagnostics')('bigpipe-minifier');

/**
 * Minifier that handles multiple types of minification for both JS and CSS.
 *
 * @Constructor
 * @param {Object} options Optinal configuration.
 * @api public
 */
function Minifier(options) {
  this.options = options || {};

  this.options.css = options.css || {};
  this.options.js = options.js || {};
}

/**
 * Minify the JS.
 *
 * @param {File} file File representation of the BigPipe compiler.
 * @param {Function} done Completion callback.
 * @api public
 */
Minifier.prototype.js = function js(file, done) {
  var options = this.options.js
    , tool = options.tool
    , content, code;

  debug('Minifying JS %s with %s', file.hash, options.name);

  switch(options.name) {
    //
    // Currently just use the whole callchain of uglify-js in stead of the
    // `minify` node.js tool, it has horrible configuration support.
    //
    case 'uglify-js':
    default:
      options = tool.defaults(options, {
        compress: options.compress || {},
        mangle: options.mangle || {},
        fromString: true
      });

      //
      // 1. parse
      //
      content = tool.parse(file.code, options);

      //
      // 2. compress
      //
      content.figure_out_scope();
      options.compress.screw_ie8 = options.compress.screw_ie8 || options.screw_ie8;
      options.compress.warnings = options.compress.warnings || false;
      content = content.transform(tool.Compressor(options.compress));

      //
      // 3. mangle
      //
      options.mangle.screw_ie8 = options.mangle.screw_ie8 || options.screw_ie8;
      content.figure_out_scope(options.mangle);
      content.compute_char_frequency(options.mangle);
      content.mangle_names(options.mangle);

      //
      // 4. output
      //
      code = tool.OutputStream();
      content.print(code);
      done(null, ''+ code);

      break;
  }
};

/**
 * Minify the CSS.
 *
 * @param {File} file File representation of the BigPipe compiler.
 * @param {Function} done Completion callback.
 * @api public
 */
Minifier.prototype.css = function css(file, done) {
  var options = this.options.css;

  debug('Minifying CSS %s with %s', file.hash, options.name);

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
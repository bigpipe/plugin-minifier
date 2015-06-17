'use strict';

var debug = require('diagnostics')('bigpipe-minifier')
  , Minifier = require('./minifier');

function valid(tool) {
  return 'function' === typeof tool || 'object' === typeof tool;
}

//
// Plugin name.
//
exports.name = 'minifier';


//
//
//
exports.server = function server(bigpipe, options) {
  options = options('minifier', {});

  var css = valid(options.css.tool)
    , js = valid(options.js.tool)
    , minify;

  minify = new Minifier(options);
  bigpipe._compiler.on('register', function minifier(file, next) {
    debug(
      'Registered %s of type %s, checking if eligible for minification',
      file.hash,
      file.extname
    );

    //
    // Only process files that have registered minifiers.
    //
    if (!file.is('js') && !file.is('css')) return;
    if ((!js && file.is('js')) || (!css && file.is('css'))) return;

    //
    // Call the registered minification tool and store the minified content
    // to the file.
    //
    minify[file.is('js') ? 'js' : 'css'](file, function (error, minified) {
      if (error) return next(error);

      minified = new Buffer(minified);
      debug('Minified content, %d reduced to %d bytes', file.length, minified.length);

      file.set(minified);
      next();
    });
  });
};
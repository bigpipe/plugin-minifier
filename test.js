'use strict';

var EventEmitter = require('events').EventEmitter
  , File = require('bigpipe/lib/file')
  , BigPipe = require('bigpipe')
  , assume = require('assume')
  , minifier = require('./')
  , bigpipe, file, options;

describe('BigPipe - Plugin Minifier', function () {
  describe('is module', function () {
    it('which exports name minifier', function () {
      assume(minifier.name).to.be.a('string');
      assume(minifier.name).to.equal('minifier');
    });

    it('which exports server side plugin', function () {
      assume(minifier.server).to.be.a('function');
      assume(minifier.server.length).to.equal(2);
    });
  });

  describe('server side plugin', function () {
    beforeEach(function () {
      options = function get() {
        return {};
      };
      file = new File;
      bigpipe = new BigPipe;
    });

    afterEach(function () {
      file = bigpipe = null;
    });

    it('waits for register event', function (done) {
      minifier.server(bigpipe, options);

      assume(bigpipe._compiler._events).to.have.property('register');
      bigpipe._compiler.emit('register', file, done);
    });
  });
});
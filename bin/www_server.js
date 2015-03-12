#!/usr/local/bin/iojs --harmony

(function() {
  'use strict';
  // jshint esnext:true

  var os = require("os");
  var path = require('path');
  var app = require('koa')();
  var chalk = require('chalk');
  var serve = require('koa-static');
  var logger = require('koa-logger');
  var mount = require('koa-mount');
  var compress = require('koa-compress');
  var cors = require('koa-cors');
  app.use(cors());

  var PORT = process.env.PORT || 3003;
  var DIST_DIR = path.join(__dirname, '../app/dist');
  var BOWER_DIR = path.join(__dirname, '../bower_components');

  if (process.env.WATCH === 'true') {
    var livereload = require('koa-livereload');
    app.use(livereload());
    var lr = require('livereload');
    var lrs = lr.createServer();
    lrs.watch(DIST_DIR);
    var lrMsg = chalk.bgRed.bold.white(' LIVERELOAD ');
  }

  app.use(compress());

  if (require.main === module) {
    app.use(logger());
  }

  app.use(mount('/', serve(DIST_DIR)));
  app.use(mount('/lib', serve(BOWER_DIR)));

  // main
  var listen = function(port) {
    port = port || PORT;
    console.log(`[${chalk.red(new Date().toLocaleTimeString())}] Front end server running on localhost:${chalk.red(port || process.env.PORT)} (${process.env.NODE_ENV.toUpperCase()}) ${lrMsg || ''}`);
    app.listen(port);
  };

  module.parent ? module.exports = exports = listen : listen();
}());

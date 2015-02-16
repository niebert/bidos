#!/usr/local/bin/iojs

(function() {
  'use strict';
  // jshint esnext:true

  var defaultPort = '3001';

  var path = require('path');
  var app = require('koa')();
  var chalk = require('chalk');
  var mount = require('koa-mount');
  var serve = require('koa-static');
  app.use(require('koa-cors')());
  app.use(require('koa-compress')());

  if (require.main === module) {
    app.use(require('koa-logger')());
  }

  // serve static dirs
  app.use(mount('/', serve(path.join(__dirname, 'dist'))));
  app.use(mount('/', serve(path.join(__dirname, 'src'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));

  // main
  var listen = function(port) {
    port = port || defaultPort;
    console.log(chalk.red('>> webserver accessible on http://localhost:' + port));
    app.listen(port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

#!/usr/local/bin/iojs --harmony

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

	var DIST_DIR = '../app/dist';
	var TEMPLATE_DIR = '../app/src'; // NOT SO GOOD I GUESS
	var BOWER_DIR = '../bower_components';

  // serve static dirs
  app.use(mount('/', serve(path.join(__dirname, DIST_DIR))));
  app.use(mount('/', serve(path.join(__dirname, TEMPLATE_DIR))));
  app.use(mount('/lib', serve(path.join(__dirname, BOWER_DIR))));

  // main
  var listen = function(port) {
    port = port || defaultPort;
    console.log(chalk.red('>> web front end running on http://localhost:' + port));
    app.listen(port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

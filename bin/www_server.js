#!/usr/local/bin/iojs --harmony

(function() {
  'use strict';
  // jshint esnext:true

  var path = require('path');
  var app = require('koa')();
  var chalk = require('chalk');
  var serve = require('koa-static');
  var logger = require('koa-logger');
  var compress = require('koa-compress');
  var livereload = require('koa-livereload');
  var cors = require('koa-cors');
  app.use(cors());

  var PORT = process.env.PORT || 3001;
  var DIST_DIR = path.join(__dirname, '../app/dist');

  var lr = require('livereload');
  var lrs = lr.createServer();
  lrs.watch(DIST_DIR);

  app.use(compress());
  app.use(livereload());

  if (require.main === module) {
    app.use(logger());
  }

  app.use(serve(DIST_DIR));

  // main
  var listen = function(port) {
    port = port || PORT;
    console.log(chalk.red('>> web front end running on http://localhost:' + port));
    app.listen(port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

(function() {
  'use strict';
  //jshint esnext:true

  var config = require('./config');
  var routes = require('./routes');

  var chalk = require('chalk');

  var app = require('koa')();
  var cors = require('koa-cors');
  var compress = require('koa-compress');
  var validate = require('koa-validate');
  var bodyparser = require('koa-bodyparser');

  let db = require('./middleware/db');
  let auth = require('./middleware/auth');

  let mount = require('./lib/mount');

  app.use(compress());
  app.use(validate());
  app.use(bodyparser());

  if (require.main === module) {
    // app.use(require('./logger')()); // FIXME crashes, saying too many open files
    app.use(require('koa-logger')()); // use bunyan only
  }

  // inject cors headers
  app.use(cors({
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
  }));

  // test databse connection
  app.use(db());

  // mount public routes
  mount(routes.public, '/');

  // authenticate
  if (!process.env.NOAUTH) {
    app.use(auth);
  } else {
    console.warn(chalk.bgRed.bold.white(' DISABLED AUTHENTICATION '));
  }

  // mount protected routes
  mount(routes.private, '/v1/');

  // main
  var listen = function(port) {
    app.listen(port || config.port);
    console.log(`[${chalk.green(new Date().toLocaleTimeString())}] API server running on localhost:${chalk.green(port || config.port)} (${process.env.NODE_ENV.toUpperCase()})`);
  };

  module.parent ? module.exports = exports = listen : listen();
}());


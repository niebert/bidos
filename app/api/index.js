(function() {
  'use strict';
  //jshint esnext:true

  var config = require('./config');
  var routes = require('./routes');

  var chalk = require('chalk');
  var _ = require('lodash');

  var app = require('koa')();
  var cors = require('koa-cors');
  var mount = require('koa-mount');
  var compress = require('koa-compress');
  var validate = require('koa-validate');
  var bodyparser = require('koa-bodyparser');

  let db = require('./middleware/db');
  let auth = require('./middleware/auth');

  function mountRoutes(_routes, mountPoint) {
    _.each(_routes, function(d, i) {
      app.use(mount(mountPoint + i, d.middleware()));
    });
  }

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
  mountRoutes(routes.public, '/');

  // routes below the next middleware call are only accessible to authenticated
  // clients.  if the authorization succeeds, next is yielded and the following
  // routes are reached. if it fails, it throws and the previous middleware
  // will catch that error and send back status 401 and redirect to /login.

  // authenticate
  if (!process.env.NOAUTH) {
    app.use(auth);
  } else {
    console.warn(chalk.bgRed.bold.white(' DISABLED AUTHENTICATION '));
  }

  // secured routes
  mountRoutes(routes.private, '/v1/');

  // main
  var listen = function(port) {
    app.listen(port || config.port);
    console.log(`[${chalk.green(new Date().toLocaleTimeString())}] API server running on localhost:${chalk.green(port || config.port)} (${process.env.NODE_ENV.toUpperCase()})`);
  };

  module.parent ? module.exports = exports = listen : listen();
}());


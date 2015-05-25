(function() {
  'use strict';
  //jshint esnext:true

  var config = require('./config');
  var routes = require('./routes');

  var chalk = require('chalk');
  var _ = require('lodash');

  var app = require('koa')();
  var pg = require('koa-pg');
  var jwt = require('koa-jwt');
  var cors = require('koa-cors');
  var mount = require('koa-mount');
  var compress = require('koa-compress');
  var validate = require('koa-validate');
  var bodyparser = require('koa-bodyparser');

  // catch authorization failure and custom 401 handling to hide koa-jwt
  // errors from users: instantly moves on to the next middleware and handles
  // eventually thrown errors.
  function* auth(next) {
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (err.status === 401) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Error: Protected resource. No Authorization header found.\n';
        console.warn('user is not authenticated');
      }
      else {
        throw err;
      }
    }
  }

  // catches database error
  function* db(next) {
    try {
      yield next;
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error('Database offline');
      }
      else {
        console.error('Database error');
      }
      this.throw(err);
    }
  }

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

  // connect to database
  app.use(function*(next) {
    yield db.call(this, pg(config.db).call(this, next)); // <3
  });

  // mount public routes
  mountRoutes(routes.public, '/');

  // routes below the next middleware call are only accessible to authenticated
  // clients.  if the authorization succeeds, next is yielded and the following
  // routes are reached. if it fails, it throws and the previous middleware
  // will catch that error and send back status 401 and redirect to /login.
  app.use(function*(next) {
    yield auth.call(this, jwt({
      secret: config.secret
    }).call(this, next));
  });

  // secured routes
  mountRoutes(routes.private, '/v1/');

  // main
  var listen = function(port) {
    app.listen(port || config.port);
    console.log(`[${chalk.green(new Date().toLocaleTimeString())}] API server running on localhost:${chalk.green(port || config.port)} (${process.env.NODE_ENV.toUpperCase()})`);
  };

  module.parent ? module.exports = exports = listen : listen();
}());


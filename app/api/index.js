//jshint esnext:true
(function() {
  'use strict';

  var config = require('./config')[process.env.NODE_ENV || 'development'];
  var routes = require('./routes');

  var _ = require('lodash');
  var chalk = require('chalk');
  // var columnify = require('columnify');

  var koa = require('koa');
  var pg = require('koa-pg');
  var jwt = require('koa-jwt');
  var cors = require('koa-cors');
  var mount = require('koa-mount');
  var logger = require('koa-logger');
  var compress = require('koa-compress');
  var validate = require('koa-validate');
  var bodyparser = require('koa-bodyparser');

  var app = koa();
  // catch authorization failure and custom 401 handling to hide koa-jwt
  // errors from users: instantly moves on to the next middleware and handles
  // eventually thrown errors.
  function* auth(next) {
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 === err.status) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Error: Protected resource. No Authorization header found.\n';
        this.log.warn('user is not authenticated');
      } else {
        throw err;
      }
    }
  }

  app.use(cors({
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
  }));
  // catches database error
  function* db(next) {
    try {
      yield next;
    } catch (err) {
      if ('ECONNREFUSED' === err.code) {
        this.log.error('Database offline');
      } else {
        this.log.error('Database error');
      }
      this.throw(err);
    }
  }

  app.use(bodyparser());
  app.use(compress());
  app.use(validate());

  app.use(require('./logger')());
  if (require.main === module) {
    app.use(logger());
  }

  // mount public routes
  mountRoutes(routes.public, '/');
	console.log(routes.public);

  // connect to database
  app.use(function*(next) {
    yield db.call(this, pg(config.db.postgres.url).call(this, next));
  });


  // routes below the next loc are only accessible to authenticated clients.
  // if the authorization succeeds, next is yielded and the following routes
  // are reached. if it fails, it throws and the previous middleware will catch
  // that error and send back status 401 and redirect to /login.
  app.use(function*(next) {
    yield auth.call(this, jwt({
      secret: config.secret.key
    }).call(this, next));
  });

  // secured routes
  mountRoutes(routes.private, '/v1/');

  // main
  var listen = function(port) {
    console.log(chalk.red.bold(`[${new Date().toLocaleTimeString()}] `) + chalk.red('API running on localhost:' + (port || config.app.port)) + ' (' + process.env.NODE_ENV.toUpperCase() + ')');
    app.listen(port || config.app.port);
  };


  function mountRoutes(_routes, mountPoint) {
    _.each(_routes, function(d, i) {
      app.use(mount(mountPoint + i, d.middleware()));
    });
  }

  // function logRoutes(routes, mountPoint, name) {
  //   console.log('\n' + chalk.cyan('>> ' + name + ' routes'));
  //   console.log(columnify(_.map(routes, function(d, i) {
  //     return {
  //       'PATH': mountPoint + i,
  //       'request method': _(d.methods)
  //         .map()
  //         .tail()
  //         .join(' ')
  //     };
  //   }), {
  //     columnSplitter: ' | '
  //   }));
  // }

  // logRoutes(routes.public, '/', 'public');
  // logRoutes(routes.private, '/v1/', 'private');

  module.parent ? module.exports = exports = listen : listen();
}());

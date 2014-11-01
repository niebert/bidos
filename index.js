//jshint esnext:true
(function() {
	'use strict';

  // see ./config/index.js
  var config = require('./config')[process.env.NODE_ENV];

  // node core
  var path = require('path');

  // utilities
  var lodash = require('lodash');

  // koa itself
  var app = require('koa')();

  // authentication
  var jwt = require('koa-jwt');

  // database and orm
  var pg = require('koa-pg');
  app.use(pg(config.postgres.url));

  // miscellaneous middleware
  var mount = require('koa-mount'),
      serve = require('koa-static'),
      views = require('koa-views');

  app.use(require('koa-logger')());
  app.use(require('koa-bodyparser')());
  app.use(require('koa-compress')());

  // plain html files are rendered from ./views
  app.use(views('views', {
    default: 'html',
    cache: false
  }));

  // initialize routes
  var routes = require('./config/routes');

  // mount public routes
  app.use(mount('/', serve(path.join(__dirname, 'public'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));
  app.use(mount('/', routes.auth.middleware())); // POST /login, GET /logout
  app.use(mount('/', routes.public.middleware())); // GET /

  // custom 401 handling to hide koa-jwt errors from users: instantly moves on
  // to the next middleware and returns here, if that fails.
  app.use(function *(next) {
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 == err.status) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Error: Protected resource. No Authorization header found.\n';
        console.log('user is not authenticated')
      } else {
        throw err;
      }
    }
  });

  /* Routes below the next loc are only accessible to authenticated clients. */

  // app.use(function *(next) {});
  app.use(jwt({ secret: config.session.secret }));

  // secured routes
  app.use(mount('/', serve(path.join(__dirname, 'private'))));
  app.use(mount('/', serve(path.join(__dirname, 'views'))));

  app.use(function *() {
    console.log('last');
    yield this.render('index');
  });

  // main
  var listen = function(port) {
    app.listen(config.app.port);
    console.log('api accessible on port ' + (config.app.port));
  };

  require.main === module ? listen() : module.exports = exports = listen;
}());

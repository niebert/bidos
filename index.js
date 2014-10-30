//jshint esnext:true
(function() {
	'use strict';

  // see ./config/index.js
  var config = require('./config')[process.env.NODE_ENV];

  // node core
  var path = require('path');

  // utilities
  var lodash = require('lodash'),
      Promise = require('bluebird');

  // koa itself
  var app = require('koa')();

  // sessions
  var session = require('koa-generic-session'),
      RedisStore = require('koa-redis');

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

  // sessions
  app.keys = config.session.keys;
  app.use(session({
    // store: new RedisStore(), // persistent sessions TODO do we really want redis?
    // key: config.session.cookie, // cookie name TODO we dont need no cookies anymore
  }));

  // initialize routes
  var routes = require('./config/routes');

  // mount public routes
  app.use(mount('/', routes.public.middleware())); // GET /
  app.use(mount('/', routes.auth.middleware())); // POST /login, GET /logout
  app.use(mount('/css', serve(path.join(__dirname, 'public/css'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));

  // Custom 401 handling if you don't want to expose koa-jwt errors to users
  app.use(function *(next) {

    /* instantly moves on to the next middleware and return here, if that fails. */

    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 == err.status) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Protected resource. Use authorization header to get access.\n';
      } else {
        throw err;
      }
    }
  });

  /* Authorization happens next. The header sent by the client via POST must
  /* contain a validable base64 encoded payload.

      http://jwt.io/
      https://github.com/auth0/angular-jwt

  /* Routes below the next loc are ony accessible to authenticated clients and
  /* should be considered secure. */

  // TODO handle user roles
  app.use(jwt({ secret: config.session.secret })); // TODO .unless({ path: [ '/login' ]}));

  // secured routes
  app.use(mount('/js', serve(path.join(__dirname, 'public/js'))));
  app.use(mount('/', serve(path.join(__dirname, 'views'))));

  // main
  var listen = function(port) {
    app.listen(config.app.port);
    console.log('api running on port ' + (config.app.port));
  };

  require.main === module ? listen() : module.exports = exports = listen;
}());

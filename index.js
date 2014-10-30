//jshint esnext:true
(function() {
	'use strict';

  var fs = require('fs'),
      path = require('path');

	var lodash = require('lodash'),
      Promise = require('bluebird');

  var app        = require('koa')(),
      pg         = require('koa-pg'),
      session    = require('koa-generic-session'),
      bodyparser = require('koa-bodyparser'),
      compress   = require('koa-compress'),
      logger     = require('koa-logger'),
      mount      = require('koa-mount'),
      RedisStore = require('koa-redis'),
      serve      = require('koa-static'),
      views      = require('koa-views'),
      jwt        = require('koa-jwt');

  // TODO use process.env.NODE_ENV
  var config = require('./config').development; // development, test, production

  // random middleware
  app.use(logger());
  app.use(bodyparser());
  app.use(compress());

  // views
  app.use(views('views', {
    default: 'html',
    cache: false
  }));

  // postgres
  app.use(pg(config.postgres.url));

  // sessions
  app.keys = config.session.keys;
  app.use(session({
    store: new RedisStore(), // persistent sessions
    key: config.session.cookie, // cookie name
  }));

  // initialize routes
  var routes = require('./config/routes');

  // public routes
  app.use(mount('/', routes.public.middleware()));
  app.use(mount('/', routes.auth.middleware()));

  // Custom 401 handling if you don't want to expose koa-jwt errors to users
  app.use(function *(next){
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 == err.status) {
        this.status = 401;
        // authentication is possible but has failed
        this.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    }
  });

  // authorization
  app.use(jwt({ secret: config.session.secret })); // .unless({ path: [ '/login' ]}));

  // secured routes
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));
  app.use(mount('/', serve(path.join(__dirname, 'public'))));
  app.use(mount('/', serve(path.join(__dirname, 'views'))));

  var listen = function(port) {
    app.listen(config.app.port);
    console.log('api running on port ' + (config.app.port));
  };

  if (require.main === module) {
    listen(); // called directly
  } else {
    module.exports = exports = listen; // required as module
  }

}());

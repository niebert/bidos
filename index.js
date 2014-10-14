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
      views      = require('koa-views');

  var config = require('./config').remote_dev; // local_test, remote_dev

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

  // initialize more
  var passport = require('./config/passport')(app),
      routers = require('./config/routers')(app);

  // authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // public routes
  app.use(mount('/', routers.auth.middleware()));
  app.use(mount('/', serve(path.join(__dirname, 'public'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));

  var secured = function*(next) {
    if (this.isAuthenticated()) {
      console.log('authorized');
      yield next;
    } else {
      console.log('unauthorized');
      this.redirect('/login');
    }
  };

  app.use(secured); // TODO

  // secured routes
  app.use(mount('/api', routers.trips.middleware()));
  app.use(mount('/api', routers.helpers.middleware()));
  app.use(mount('/api', routers.sensors.middleware()));
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
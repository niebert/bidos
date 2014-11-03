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

  // orm
  // var database = require('./config/database')();

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

  // serve static dirs
  app.use(mount('/', serve(path.join(__dirname, 'public'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));

  // mount public routes
  app.use(mount('/', routes.auth.middleware()));
  app.use(mount('/', routes.public.middleware()));

  // custom 401 handling to hide koa-jwt errors from users: instantly moves on
  // to the next middleware and returns here, if that fails.
  app.use(function *(next) {
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 == err.status) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Error: Protected resource. No Authorization header found.\n';
        console.log('user is not authenticated');
        this.redirect('/login');
      } else {
        throw err;
      }
    }
  });

  // routes below the next loc are only accessible to authenticated clients
  app.use(jwt({ secret: config.session.secret }));

  // secured routes
  app.use(mount('/v1', routes.api.middleware()));

  var database = require('./config/database')();

  // main
  var listen = function(port) {
    app.listen(config.app.port);
    console.log('api accessible on port ' + (config.app.port));
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

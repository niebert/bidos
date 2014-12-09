//jshint esnext:true
(function() {
	'use strict';

  var _ = require('lodash');

  var config = require('./server/config')[process.env.NODE_ENV || 'development'],
      routes = require('./server/routes');

  // node core
  var path = require('path');

  // koa itself
  var app = require('koa')();

  // authentication
  var jwt = require('koa-jwt');

  // miscellaneous middleware
  var mount = require('koa-mount'),
      serve = require('koa-static');

  app.use(require('koa-bodyparser')());
  app.use(require('koa-compress')());

  if (require.main === module) {
    app.use(require('koa-logger')());
  }

  // database
  app.use(require('koa-pg')(config.db.postgres.url));

  // serve static dirs
  app.use(mount('/build', serve(path.join(__dirname, 'client/build'))));
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));
  app.use(mount('/', serve(path.join(__dirname, 'client/src'))));

  // mount public routes
  app.use(mount('/', routes.auth.middleware()));

  // custom 401 handling to hide koa-jwt errors from users: instantly moves on
  // to the next middleware and returns here, if that fails.
  app.use(function *(next) {
    try {
      yield next; // -> jwt authorization
    } catch (err) {
      if (401 === err.status) {
        this.status = 401; // authentication is possible but has failed
        this.body = 'Error: Protected resource. No Authorization header found.\n';
        console.log('user is not authenticated');
      } else {
        throw err;
      }
    }
  });

  // routes below the next loc are only accessible to authenticated clients.
  // if the authorization succeeds, next is yielded and the following routes
  // are reached. if it fails, it throws and the previous middleware will
  // catch that error and send back status 401 and redirect to /login.
  // app.use(jwt({ secret: config.secret.key })); // <-- decrypts

  // secured routes
  app.use(mount('/v1/user', routes.user.middleware()));

  // TODO: bundle and abstract resources to provide fewer entry points

  // resource: subjects
  app.use(mount('/v1/group', routes.group.middleware()));
  app.use(mount('/v1/kid', routes.kid.middleware()));

  // resource: categories
  app.use(mount('/v1/domain', routes.domain.middleware()));
  app.use(mount('/v1/subdomain', routes.subdomain.middleware()));
  app.use(mount('/v1/item', routes.item.middleware()));

  // resource: items
  app.use(mount('/v1/behaviour', routes.behaviour.middleware()));
  app.use(mount('/v1/example', routes.example.middleware()));

  // resource: surveys
  app.use(mount('/v1/rating', routes.rating.middleware()));
  app.use(mount('/v1/sheet', routes.sheet.middleware()));

  // full resources (get all only, for sync to client)
  app.use(mount('/v1/resources', routes.resources.middleware()));

  // main
  var listen = function(port) {
    console.log('api accessible on port ' + (port || config.app.port));
    app.listen(port || config.app.port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

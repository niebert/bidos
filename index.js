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

  // colors! ^^
  var chalk = require('chalk');
  var columnify = require('columnify');

  // authentication
  var jwt = require('koa-jwt');

  // miscellaneous middleware
  var mount = require('koa-mount'),
      serve = require('koa-static');

  app.use(require('koa-bodyparser')());
  app.use(require('koa-compress')());
  app.use(require('koa-validate')());

  if (require.main === module) {
    app.use(require('koa-logger')());
  }

  // database
  app.use(require('koa-pg')(config.db.postgres.url));

  // serve static dirs
  app.use(mount('/lib', serve(path.join(__dirname, 'bower_components'))));
  app.use(mount('/build', serve(path.join(__dirname, 'build'))));
  app.use(mount('/', serve(path.join(__dirname, 'client')))); // FIXME: .html only

  // fancy console output
  console.log('\n' + chalk.cyan('>> public routes'));
  console.log(columnify(_.map(routes.public, function(d,i) {
		return {
			'PATH': '/' + i,
			'request method': _(d.methods).map().tail().join(' ') };
		}), { columnSplitter: ' | ' }));

  // mount public routes
  _.each(routes.public, function(d,i) {
    app.use(mount('/' + i, d.middleware()));
  });

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
	// are reached. if it fails, it throws and the previous middleware will catch
	// that error and send back status 401 and redirect to /login.

  // app.use(jwt({ secret: config.secret.key })); // <-- decrypts

  // fancy console output
  console.log('\n' + chalk.cyan('>> private routes'));
	console.log(columnify(_.map(routes.private, function(d,i) {
		return {
			'PATH': '/v1/' + i,
			'request method': _(d.methods).map().tail().join(' ') };
		}), { columnSplitter: ' | ' }));

  // secured routes
  _.each(routes.private, function(d,i) {
    app.use(mount('/v1/' + i, d.middleware()));
  });

  // main
  var listen = function(port) {
    console.log(chalk.green('>> api accessible on port ' + (port || config.app.port)));
    app.listen(port || config.app.port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;
}());

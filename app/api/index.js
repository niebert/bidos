//jshint esnext:true
(function() {
  'use strict';

  var config = require('./config')[process.env.NODE_ENV || 'development'];
  var routes = require('./routes');

  var _ = require('lodash');
  var chalk = require('chalk');
  var columnify = require('columnify');

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

  app.use(cors());
  app.use(bodyparser());
  app.use(compress());
  app.use(validate());

  if (require.main === module) {
    app.use(logger());
  }

  // connect to database (TODO check if postgres is running!)
  app.use(pg(config.db.postgres.url));

  // mount public routes
  mountRoutes(routes.public, '/');

  // custom 401 handling to hide koa-jwt errors from users: instantly moves on
  // to the next middleware and returns here, if that fails.
  app.use(function*(next) {
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

  app.use(jwt({
    secret: config.secret.key
  })); // <-- decrypts

  // secured routes
  mountRoutes(routes.private, '/v1/');

  // main
  var listen = function(port) {
    console.log(chalk.red('>> api accessible on port ' + (port || config.app.port)));
    app.listen(port || config.app.port);
  };

  /*jshint -W030 */
  require.main === module ? listen() : module.exports = exports = listen;

  function mountRoutes(routes, mountPoint) {
    _.each(routes.private, function(d, i) {
      app.use(mount(mountPoint + i, d.middleware()));
    });
  }

  function logRoutes(routes, mountPoint, name) {
    console.log('\n' + chalk.cyan('>> ' + name + ' routes'));
    console.log(columnify(_.map(routes, function(d, i) {
      return {
        'PATH': mountPoint + i,
        'request method': _(d.methods)
          .map()
          .tail()
          .join(' ')
      };
    }), {
      columnSplitter: ' | '
    }));
  }

  logRoutes(routes.public, '/', 'public');
  logRoutes(routes.private, '/v1/', 'private');

}());

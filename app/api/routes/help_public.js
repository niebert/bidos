//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()
    .get('/help', help);

  function* help() {
    this.status = 201;
  }

}());


// var columnify = require('columnify');
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

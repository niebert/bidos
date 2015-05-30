'use strict';

let _ = require('lodash');
let mount = require('koa-mount');

module.exports = function(app) {
  return function mountRoutes(routes, mountPoint) {
    if (!routes) return;

    _.each(routes, function(route, routeName) {

      try {
        // _.map(route.stack.routes, function(path) { console.log(path); }); // TODO have pretty route printing
        app.use(mount(mountPoint + routeName, route.middleware()));
      } catch (err) {
        debugger
        console.warn('skipping illegal route. FIXME!', err);
        return;
      }

    });
  };
};

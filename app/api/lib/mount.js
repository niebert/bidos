'use strict';
let _ = require('lodash');
let mount = require('koa-mount');
module.exports = function(app) {
  return function mountRoutes(routes, mountPoint) {
    _.each(routes, function(d, i) {
      app.use(mount(mountPoint + i, d.middleware()));
    });
  };
};

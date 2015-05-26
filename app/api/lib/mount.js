'use strict';
let _ = require('_');
let mount = require('koa-mount');
module.exports = function mountRoutes(app, routes, mountPoint) {
  _.each(routes, function(d, i) {
    app.use(mount(mountPoint + i, d.middleware()));
  });
};

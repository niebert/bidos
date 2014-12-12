//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');

  function *getAllResources() {
    var kids = yield this.pg.db.client.query_({
      name: 'getAllKidResources',
      text: 'SELECT * from kid_resources;'
    });

    var items = yield this.pg.db.client.query_({
      name: 'getAllItemResources',
      text: 'SELECT * from item_resources;'
    });

    this.body = {
      resources: {
        domains: items.rows[0].domains,
        groups: kids.rows[0].groups
      }
    };
  }

  module.exports = exports = new Router()
    .get('getAllResources', '/', getAllResources);

}());

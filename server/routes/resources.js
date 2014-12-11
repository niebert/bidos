//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  function *getAllItemResources() {
    var result = yield this.pg.db.client.query_({
      name: 'getAllItemResources',
      text: 'SELECT * from item_resources;'
    });
    this.body = result.rows;
  }

  function *getAllKidResources() {
    var result = yield this.pg.db.client.query_({
      name: 'getAllKidResources',
      text: 'SELECT * from kid_resources;'
    });
    this.body = result.rows;
  }

  function *getAllResources() {
    var resources = {};

    var kids = yield this.pg.db.client.query_({
      name: 'getAllResources',
      text: 'SELECT * from kid_resources;'
    });
    _.merge(resources, kids.rows[0]);

    var items = yield this.pg.db.client.query_({
      name: 'getAllItemResources',
      text: 'SELECT * from item_resources;'
    });
    _.merge(resources, items.rows[0]);

    this.body = resources;
  }

  module.exports = exports = new Router()
    .get('getAllResources', '/', getAllResources)
    .get('getAllItemResources', '/items', getAllItemResources)
    .get('getAllKidResources', '/kids', getAllKidResources);

}());

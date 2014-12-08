//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()

    .get('getAllItemResources', '/items', function *getAllItemResources() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllItemResources',
        text: 'SELECT * from item_resources;'
      });
      this.body = result.rows;
    })

    .get('getAllKidResources', '/kids', function *getAllKidResources() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllKidResources',
        text: 'SELECT * from kid_resources;'
      });
      this.body = result.rows;
    });

}());

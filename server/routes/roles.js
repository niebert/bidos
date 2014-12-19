//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()

  .get('getAllRoles', '/', function* getAllRoles() {

    var result =
      yield this.pg.db.client.query_({
        name: 'getAllRoles',
        text: 'SELECT * FROM roles'
      });

    this.body = {
      roles: result.rows
    };

  });

}());

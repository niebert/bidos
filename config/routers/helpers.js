//jshint esnext:true

(function() {
	'use strict';

	var Router = require('koa-router');
	var lodash = require('lodash');
	var statements = require('../statements');

  var router = new Router();

  router.get('/tables', function*() {
    var result = yield this.pg.db.client.query_(statements.helpers.allTables);
    this.body = result.rows;
    this.status = result.rowCount ? 200 : 204;
  });

  module.exports = function (app) {
    return { helpers: router };
  };

}());
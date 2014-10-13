//jshint esnext:true

(function() {
	'use strict';

	var Router = require('koa-router');
	var lodash = require('lodash');
	var statements = require('../statements');

  var router = new Router();

  router.get('/trips', function*() {
    var result = yield this.pg.db.client.query_(statements.trips.all);
    this.body = result.rows;
    this.status = result.rowCount ? 200 : 204;
  });

  // module.exports = exports = { trips: router };


  module.exports = function (app) {
    return { trips: router };
  };

}());
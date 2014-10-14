//jshint esnext:true

(function() {
	'use strict';

	var Router = require('koa-router');
	var lodash = require('lodash');
  var router = new Router();

  module.exports = function (app) {
    var statements = require('../statements')(app);

    router.get('/sensor/:sensorName/:tripId', function*() {
      var result = yield this.pg.db.client.query_(lodash.merge({
        values: [this.params.tripId]
      }, statements.sensors.get(this.params.sensorName)));
      this.body = result.rows;
      this.status = 200;
    });

    return { sensors: router };
  };

}());
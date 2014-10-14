//jshint esnext:true

(function() {
	'use strict';

	var Router = require('koa-router');
	var lodash = require('lodash');
  var router = new Router();

  function extentToSQL(extent) {
    var e = extent.split(',');
    return ' AND ts >= ' + e[0] + ' AND ts <= ' + e[1];
  }

  module.exports = function (app) {
    var statements = require('../statements')(app);

    // router.get('/sensor/:sensorName/:tripId',
    //   function*() {
    //     var extent = this.query.e ? extentToSQL(this.query.e) : '';
    //     var result;

    //     result = yield this.pg.db.client.query_(statements.helpers.columns(this.params.sensorName));
    //     console.log(this.params.sensorName);
    //     console.log(result.rows);

    //     var columns = {
    //       name: this.params.sensorName,
    //       columns: lodash.map(result.rows, 'attname')
    //     };

    //     columns.isMotionSensor = lodash(['x', 'y', 'z']).all(function(xyz) {
    //       return lodash(columns.columns).values().contains(xyz); // XXX
    //     }.bind(this));

    //     if (columns.isMotionSensor) {
    //       result = yield this.pg.db.client.query_(lodash.merge({
    //         values: [this.query.w, this.params.tripId]
    //       }, statements.sensors.motion(this.params.sensorName, extent)));
    //     } else {
    //       result = yield this.pg.db.client.query_(lodash.merge({
    //         values: [this.params.tripId]
    //       }, statements.sensors.nonMotion(this.params.sensorName)));
    //     }

    //     console.log(columns);
    //     this.body = result.rows;
    //     this.status = 200;
    //   });

    router.get('/sensor/:sensorName/:tripId', function*() {
      var extent = this.query.e ? extentToSQL(this.query.e) : '';

      var result = yield this.pg.db.client.query_(lodash.merge({
        values: [this.params.tripId]
      }, statements.sensors.nonMotion(this.params.sensorName)));
      this.body = result.rows;
      this.status = 200;
    });

    return { sensors: router };
  };

}());
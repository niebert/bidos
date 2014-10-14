//jshint esnext:true
(function() {
	'use strict';

  var items = require('../items');

  module.exports = function (app) {

    // var user;
    // app.use(function *(next) {
    //   user = this.session.passport.user;
    //   yield next;
    // });

    var statements = {

      nonMotion: function(sensorName) {
        return {
          name: 'getNonMotionSensor',
          text: 'SELECT * FROM ' + sensorName + ' WHERE trip_id = $1 ORDER BY ts ASC'
        };
      },

      // $1: windowSize
      // $2: tripId
      motion: function(sensorName, extent) {
        // fails on tables w/o xyz columns
        return {
          name: 'getMotionSensor',
          text: 'SELECT avg(x) x, avg(y) y, avg(z) z, avg(ts) ts FROM (SELECT x, y, z, ts, NTILE($1) OVER (ORDER BY ts) AS w FROM ' + sensorName + ' WHERE trip_id = $2' + extent + ') A GROUP BY w ORDER BY w'
        };
      },

    };

    return { sensors: statements };
  };

}());
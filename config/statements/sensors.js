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

      get: function(sensorName) {
        return {
          name: 'getSensor',
          text: 'SELECT * FROM ' + sensorName + ' WHERE trip_id = $1 ORDER BY ts ASC'
        };
      },

    };

    return { sensors: statements };
  };

}());
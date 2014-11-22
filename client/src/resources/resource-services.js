(function() {
  'use strict';

  require('./resource-constants');
  require('../auth/auth-services'); // UserFactory

  angular.module('bidos.resource.services', [
    'bidos.resource.constants'
  ])

  .service('resourceService', ['$http', '$q', 'RESOURCE_URL', 'UserFactory',
    function($http, $q, RESOURCE_URL, UserFactory) {

    // tell this service what role you have and it'll return an object
    // containing all relevant data, i.e. a user with the role
    // `practitioner` for example won't get any data about `users`.

    // non authorized api requests (a) shouldn't be made here and (b) should
    // fail on the back ends side anyways.

    var resources = {};

    var url = function(resource, id) {
      return RESOURCE_URL + '/' + resource + (id ? '/' + id : '');
    };

    // TODO
    //
    // depending on who i am call all relevant read-routes and return the object

    return {
      create: function(resource, formData) {
        return $http.post(url(resource), formData);
      },

      read: function(allowedResources, id) { // id is optional
        var deferred = $q.defer();

        var queries = _(allowedResources).map(function(resource) {
          return $http.get(url(resource, id)).then(function(response) {
            resources[resource] = response.data;
          });
        });

        $q.all(queries)
        .then(function(resource) {
          resources.updated = Date.now();
          deferred.resolve(resources);
        });

        return deferred.promise;
      },

      update: function(resource, id, formData) {
        return $http.patch(url(resource, id), formData);
      },

      destroy: function(resource, id) {
        return $http.delete(url(resource, id));
      }
    };

  }]);

  // .service('Data', ['$http', '$q', function($http, $q) {

  //     // get all trips
  //     trips: function() {
  //       var deferred = $q.defer();
  //       $http.get(config.api.trips)
  //       .success(function(data) {
  //         data.forEach(function(trip) {

  //           trip.start = +trip.start;
  //           trip.stop = +trip.stop;
  //           trip.duration = trip.stop - trip.start;
  //           trip.user = trip.user.replace(/"/g, '');
  //           trip.expires = +trip.expires;

  //         });

  //         deferred.resolve(data);
  //       });

  //       return deferred.promise;
  //     },

  //     // get all sensor, gps and har data for a trip
  //     loadData: function(trip, tables) {

  //       var sensors = tables; // TODO
  //       var queries = _(sensors).map(function(sensorName) {
  //         return $http.get(config.api.sensors(trip.props.id, sensorName), {
  //           params: {
  //             'w': (trip.state.windowSize || config.windowSize),
  //             'e': (trip.state.extent && trip.state.extent.join(","))
  //           }
  //         });
  //       });

  //       // xhr to api for every sensorname, e.g. GET /api/sensors/acc/13
  //       $q.all(queries)
  //       .then(function(sensors) {
  //         _.forEach(sensors, function(sensor, i) {
  //           var sensorName = tables[i];
  //           trip.sensors[sensorName] = _.forEach(sensor.data, function(d) {
  //             d.ts = +d.ts;
  //           });
  //         });

  //         trip.state.updated = Date.now();
  //         deferred.resolve();
  //       });

  //       return deferred.promise;
  //     },

  //     deleteTrip: function(id) {
  //       return $http({ method: 'DELETE', url: 'api/trips/' + id });
  //     },

  //     undeleteTrip: function(id) {
  //       return $http({ method: 'POST', url: 'api/trips/' + id + '/undelete' });
  //     },

  //     updateTrip: function (id, value) {
  //       return $http({ method: 'POST', url: 'api/trips/' + id, data:{name:value} });
  //     },
  //   };
  // }]);

}());

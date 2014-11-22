/* global angular */

(function() {
  'use strict';

  require('./constants');

  angular.module('bidos.resource.services', [
    'bidos.resource.constants'
  ])

  .service('resourceService', resourceService);

  function resourceService($http, $q, RESOURCE_URL) {

    // tell this service what role you have and it'll return an object
    // containing all relevant data, i.e. a user with the role
    // `practitioner` for example won't get any data about `users`.

    // non authorized api requests (a) shouldn't be made here and (b) should
    // fail on the back ends side anyways.

    var resources = {};

    var url = function(resource, id) {
      return RESOURCE_URL + '/' + resource + (id ? '/' + id : '');
    };

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

  }

}());

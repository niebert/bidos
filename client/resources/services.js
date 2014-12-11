/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos.resource.services', [])

  .service('resourceService', resourceService);

  function resourceService($http, $q, API_URL) {

    // the back end will authenticate the user, check for it's group and
    // respond with the correct resource object the user is allowed to get

    var resources = {}; // resource data model

    return {

      getResources: function() {
        var deferred = $q.defer();

        $http.get(API_URL + '/v1/resources')
        .then(function(response) {
          _.merge(resources, response.data);
          resources.updatedAt = Date.now();
          deferred.resolve(resources);
        });

        return deferred.promise;
      },

      get: function(resource) {
        return $http.get(API_URL + '/v1/' + resource);
      },

      create: function(resource, formData) {
        return $http.post(API_URL + '/v1/' + resource, formData);
      },

      update: function(resource, id, formData) {
        return $http.patch(API_URL + '/v1/' + resource + '/' + id, formData);
      },

      destroy: function(resource, id) {
        return $http.delete(API_URL + '/v1/' + resource + '/' + id);
      }
    };

  }

}());

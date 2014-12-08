/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos.resource.services', [])

  .service('resourceService', resourceService);

  function resourceService($http, $q, API_URL, API_PATH) {

    // this service expects an array containing string names of allowed back
    // end resources (allowedResources). it will return a model containing all
    // data relevant to the user, i.e. a user with the role `practitioner` for
    // example won't get any data about `users`.

    // non authorized api requests should (a) not happen here and should (b)
    // fail on the back ends side anyways.

    var data = {}; // resources data model

    return {
      get: function() {
        var deferred = $q.defer();

        var queries = [
          $http.get(API_URL + API_PATH + '/resources/items'),
          $http.get(API_URL + API_PATH + '/resources/kids')
        ];

        $q.all(queries).then(function(response) {
          _.each(response, function(res) {
            _.merge(data, res.data[0]);
          });
          data.updatedAt = Date.now();
          deferred.resolve(data);
        });

        return deferred.promise;
      },

      create: function(resource, formData) {
        return $http.post(url(resource), formData); // TODO
      },

      update: function(resource, id, formData) {
        return $http.patch(url(resource, id), formData); // TODO
      },

      destroy: function(resource, id) {
        return $http.delete(url(resource, id));
      }
    };

  }

}());

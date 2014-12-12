/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos.resource.services', [])

  .service('resourceService', resourceService);

  function resourceService($http, $q, API_URL) {

    // the back end will authenticate the user, check for it's group and
    // respond with the correct resource object the user is allowed to get

    var dm = {};

    return {

      // resource can be an array or a string
      get: function(resource) {
        var deferred  = $q.defer(),
            resources = [].concat(resource),
            queries = _.map(resources, function(resource) {
              return $http.get(API_URL + '/v1/' + resource);
            });

        $q.all(queries).then(function(responses) {
          _.chain(responses).map('data').each(function(response) {
            console.info('[dm]', response);
            _.merge(dm, response);
          });
          deferred.resolve(dm);
        });

        dm.updatedAt = Date.now();
        return deferred.promise;
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

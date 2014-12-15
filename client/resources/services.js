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

      read: function(resource) {
        return dm;
      },

      // resource can be an array or a string
      get: function(resource) {

        var deferred  = $q.defer(),

            // make the argument an array and default to 'resource/vanilla'
            resources = [].concat(resource || 'resources/vanilla'),

            queries = _.map(resources, function(resource) {
              return $http.get(API_URL + '/v1/' + resource);
            });

        $q.all(queries).then(function(responses) {

          // create a non-nested data model
          _.chain(responses).map('data').each(function(response) {
            console.info('[dm]', response);
            _.merge(dm, response);
          });

          // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
          // TODO CREATE NESTED AND REFERENCED DATA MODEL TREE <3
          // the old data tree was not referenced, but plain json
          // create a referenced & nested data model for groups/users
          // create a referenced & nested data model for domains/subdomains/items/behaviours/examples

          deferred.resolve(dm);
        });

        dm.updatedAt = Date.now();
        return deferred.promise;
      },

      create: function(resource, resourceObject) {
        return $http.post(API_URL + '/v1/' + resource, resourceObject);
      },

      update: function(resource, editedResourceObject) {
        return $http.patch(API_URL + '/v1/' + resource + '/' + editedResourceObject.id, editedResourceObject);
      },

      destroy: function(resource, resourceObject) {
        return $http.delete(API_URL + '/v1/' + resource + '/' + resourceObject.id);
      }
    };

  }

}());

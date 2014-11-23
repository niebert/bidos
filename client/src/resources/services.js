/* global angular, _ */

(function() {
  'use strict';

  require('./constants');

  angular.module('bidos.resource.services', [
    'bidos.resource.constants'
  ])

  .service('resourceService', resourceService);

  function resourceService($http, $q, API_URL, API_PATH) {

    // this service expects an array containing string names of allowed back
    // end resources (allowedResources). it will return a model containing all
    // data relevant to the user, i.e. a user with the role `practitioner` for
    // example won't get any data about `users`.

    // non authorized api requests (a) should not happen here and (b) should
    // fail on the back ends side anyways.

    // see ./constants.js

    var data = {}; // resources data model

    var url = function(resource, id) {
      return API_URL + API_PATH + '/' + resource + (id ? '/' + id : '');
    };

    return {
      // id: number, optional (1 or *)
      // allowedResources: array, see ./constants
      get: function(allowedResources, id) {
        var deferred = $q.defer();

        allowedResources = [
          'user',
          'group',
          'kid',
          'domain',
          'subdomain',
          'item',
          'example',
          'behaviour'
        ];

        console.log('allowedResources', allowedResources);
        var queries = _(allowedResources).map(function(resource) {
          return $http.get(url(resource, id)).then(function(response) {
            data[resource] = _.merge((data[resource] || {}), response.data); // update data model object here
          });
        }).value();

        $q.all(queries).then(function() {
          data.updated = Date.now();
          deferred.resolve(data); // <-- resolve old/updated resources data model
        });

        return deferred.promise;
      },

      create: function(resource, formData) {
        debugger
        return $http.post(url(resource), formData);
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

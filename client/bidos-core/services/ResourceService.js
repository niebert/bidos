/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('ResourceService', ResourceService);

  function ResourceService($http, $q, API_URL, $rootScope) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* The back end will authenticate the user, check for it's group and respond
    /* with the correct resource object the user is allowed to get. */


    // if offline, store post/patch/delete requests here until we're online
    var outbox = [];

    var resources = null; // data model
    var RESOURCE_PATH = API_URL + '/v1';
    var DEFAULT_RESOURCE = 'resources/vanilla';

    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource,
    };

    // resource can be an array or a string
    function getResources(requestedResource) {

      // w/o arguments immediately return the data object
      if (!arguments.length) {
        if (!_.isEmpty(resources)) {
          return $q(function(resolve, reject) {
            if ($rootScope.networkStatus !== 'offline') {
              resolve(resources);
            } else {
              reject('FAILED GETTING DATA, CHECK YOUR INTERNET CONNECTION!');
            }
          });
        }
      }

      var deferred = $q.defer();

      // make the argument an array if it isn't already <3
      requestedResource = [].concat(requestedResource || DEFAULT_RESOURCE);

      var queries = _.map(requestedResource, function(resource) {
        return $http.get([RESOURCE_PATH, resource].join('/'));
      });

      $q.all(queries)
        .then(function(responses) {

          // create flat (i.e. non-nested) data model
          _.chain(responses)
            .map('data')
            .each(function(response) {
              console.info('[resources]', response);
              _.merge(resources, response);
            });

          deferred.resolve(resources);
        });

      resources.updatedAt = Date.now();
      return deferred.promise;
    }

    function createResource(resource, resourceObject) {
      return $http.post([RESOURCE_PATH, resource].join('/'), resourceObject)
        .then(function(response) {
          _.merge(resources, response.data);
        });
    }

    function updateResource(resource, resourceObject) {
      return $http.patch([RESOURCE_PATH, resource, resourceObject.id].join('/'), resourceObject)
        .then(function(response) {
          _.merge(resources, response.data);
        });
    }

    function destroyResource(resource, id) {
      return $http.delete([RESOURCE_PATH, resource, id].join('/'))
        .then(function() {

          resource = resource + 's'; // FIXME pluralizing here is dangerous and sucks

          // remove resource from view model array
          resources[resource].splice(_.findIndex(resources[resource], {
            id: id
          }), 1);
        });
    }

  }
}());
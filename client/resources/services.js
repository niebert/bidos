/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('resourceService', resourceService);

  function resourceService($http, $q, API_URL) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* The back end will authenticate the user, check for it's group and respond
    /* with the correct resource object the user is allowed to get. */

    var dm = {}; // data model
    var RESOURCE_PATH = API_URL + '/v1/';
    var DEFAULT_RESOURCE = 'resources/vanilla';



    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      delete: deleteResource
    };



    // resource can be an array or a string
    function getResources(resource) {

      // w/o arguments immediately return the data object
      if (!resource) {
        if (!_.isEmpty(dm)) {
          return $q;
        }
      }

      var deferred = $q.defer();

      // make the argument an array if it isn't already <3
      var resources = [].concat(resource || DEFAULT_RESOURCE);

      var queries = _.map(resources, function(resource) {
        return $http.get(RESOURCE_PATH + resource);
      });

      $q.all(queries).then(function(responses) {

        // create flat (i.e. non-nested) data model
        _.chain(responses)
          .map('data')
          .each(function(response) {
            console.info('[dm]', response);
            _.merge(dm, response);
          });

        deferred.resolve(dm);
      });

      dm.updatedAt = Date.now();
      return deferred.promise;
    }



    function createResource(resource, resourceObject) {
      return $http.post(RESOURCE_PATH + resource, resourceObject);
    }



    function updateResource(resource, id, resourceObject) {
      return $http.patch([RESOURCE_PATH, resource, id].join('/'), resourceObject);
    }



    function deleteResource(resource, id) {
      return $http.delete([RESOURCE_PATH, resource, id].join('/'));
    }

  }
}());

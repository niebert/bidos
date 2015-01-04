/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('ResourceService', ResourceService);

  function ResourceService($http, $q, API_URL, $rootScope) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* The back end will authenticate the user, check for it's group and respond
    /* with the correct resource object the user is allowed to get. */

    var dm = {}; // data model
    var RESOURCE_PATH = API_URL + '/v1';
    var DEFAULT_RESOURCE = 'resources/vanilla';

    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource,

      getGroupNameById: getGroupNameById
    };

    function getGroupNameById(groupId) {
      if (dm.groups) {
        var groupName = _.select(dm.groups, {
          id: +groupId
        })[0].name;

        return groupName;
      }
    }

    // resource can be an array or a string
    function getResources(resource) {

      // w/o arguments immediately return the data object
      if (!arguments.length) {
        if (!_.isEmpty(dm)) {
          return $q(function(resolve, reject) {
            if ($rootScope.networkStatus !== 'offline') {
              resolve(dm);
            } else {
              reject('FAILED GETTING DATA, CHECK YOUR INTERNET CONNECTION!');
            }
          });
        }
      }

      var deferred = $q.defer();

      // make the argument an array if it isn't already <3
      var resources = [].concat(resource || DEFAULT_RESOURCE);

      var queries = _.map(resources, function(resource) {
        return $http.get([RESOURCE_PATH, resource].join('/'));
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
      return $http.post([RESOURCE_PATH, resource].join('/'), resourceObject)
        .then(function(response) {
          _.merge(dm, response.data);
        });
    }

    function updateResource(resource, resourceObject) {
      return $http.patch([RESOURCE_PATH, resource, resourceObject.id].join('/'), resourceObject)
        .then(function(response) {
          _.merge(dm, response.data);
        });
    }

    function destroyResource(resource, id) {
      return $http.delete([RESOURCE_PATH, resource, id].join('/'))
        .then(function() {

          resource = resource + 's'; // FIXME pluralizing here is dangerous and sucks

          // remove resource from view model array
          dm[resource].splice(_.findIndex(dm[resource], {
            id: id
          }), 1);
        });
    }

  }
}());

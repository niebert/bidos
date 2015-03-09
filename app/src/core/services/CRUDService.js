/* global angular */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CRUD', CRUDService);

  function CRUDService($http, $q, Help) {

    /* Basic CRUD operations doing HTTP calls to the back end. */

    var config = require('../../config');

    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource
    };

    function getResources() {
      console.time('[crud] getting resources from api');
      var url = [config.app.API, config.app.RESOURCE_PATH, config.app.DEFAULT_RESOURCE].join('/');
      return $q(function(resolve, reject) {
        $http.get(url)
          .success(function(data) {
            resolve(data);
            console.timeEnd('[crud] getting resources from api', data);
          })
          .error(function(err) {
            reject(err);
            console.warn('[crud] getting resources from api', err);
          });
      });
    }

    function createResource(resource) {

      // TODO split resource properties into the ones that need to go to the
      // server side and the ones that do not. alternatively we could just
      // sent the whole thing to the api and let it weed out these things.

      if (!resource.type) {
        debugger
      }

      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type].join('/');

      if (resource.type === 'user') {
        resource.username = resource.email.split('@')[0];
      }

      return $q(function(resolve, reject) {
        $http.post(url, resource)
          .success(function(response) {
            resolve(response);
            Help.log('create resource: ', response);
          })
          .error(function(err) {
            reject(err);
            Help.warn('create resource: ' + err);
          });
      });
    }

    function updateResource(resource) {

      if (!resource.type) {
        debugger
      }

      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve, reject) {
        $http.patch(url, resource)
          .success(function(response) {
            resolve(response);
            Help.log('update resource: ', response);
          })
          .error(function(err) {
            reject(err);
            Help.warn('update resource: ' + err);
          });
      });
    }

    function destroyResource(resource) {
      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve, reject) {
        $http.delete(url)
          .success(function(response) {
            resolve(response);
            Help.log('destroy resource: ', response);
          })
          .error(function(err) {
            reject(err);
            Help.warn('destroy resource: ' + err);
          });
      });
    }
  }

}());

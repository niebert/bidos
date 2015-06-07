/* global angular */
'use strict';

angular.module('bidos')
  .service('CRUD', CRUDService);

function CRUDService($http, $q, Help, CONFIG) {

  /* Basic CRUD operations doing HTTP calls to the back end. */

  return {
    get: getResources,
    create: createResource,
    update: updateResource,
    destroy: destroyResource
  };

  function getResources() {
    console.time('[crud] getting resources from api');
    var url = [CONFIG.resources].join('/');
    return $q(function(resolve, reject) {
      $http.get(url)
        .success(function(data) {
          resolve(data);
          console.info('FRESH RESOURCES!', data);
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
      console.warn('[crud:create] resource has no type');
    }

    var url = [CONFIG.crud, resource.type].join('/');
    if (resource.type === 'user') {
      resource.username = resource.email.split('@')[0];
    }

    return $q(function(resolve, reject) {
      $http.post(url, resource)
        .success(function(response) {
          resolve(response);
        })
        .error(function(err) {
          reject(err);
        });
    });
  }

  function updateResource(resource) {

    if (!resource.type) {
      // debugger
    }

    var url = [CONFIG.crud, resource.type, resource.id].join('/');
    return $q(function(resolve, reject) {
      $http.patch(url, resource)
        .success(function(response) {
          resolve(response);
        })
        .error(function(err) {
          reject(err);
        });
    });
  }

  function destroyResource(resource) {

    var url = [CONFIG.crud, resource.type, resource.id].join('/');

    return $q(function(resolve, reject) {
      $http.delete(url)
        .success(function(response) {
          resolve(response);
        })
        .error(function(err) {
          reject(err);
        });
    });
  }
}

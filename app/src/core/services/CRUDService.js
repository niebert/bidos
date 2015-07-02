'use strict';
/* global angular */

angular.module('bidos')
.service('CRUD', CRUDService);

function CRUDService($http, $q, Help, CONFIG, $rootScope) {

  let resourcePromise = null;

  return {
    get: getResources,
    create: createResource,
    update: updateResource,
    destroy: destroyResource
  };

  function getResources() {
    if (!resourcePromise) {
      resourcePromise = $q(getVanillaResources);
    }
    return resourcePromise;
  }

  function getVanillaResources(resolve, reject) {
    console.time('get resources');
    var url = [CONFIG.resources].join('/');
    $http.get(url).success(function(data) {
      console.timeEnd('get resources');
      resourcePromise = null;
      resolve(data);
    }).error(function(err) {
      console.warn('you should log out an log in again');
      resourcePromise = null;
      reject(err);
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

    // if (resource.type === 'user') {
    //   resource.username = resource.email.split('@')[0];
    // }

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

(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .service('Resources', ResourceService);

  function ResourceService($rootScope, $q, Help, Cache, Outbox, CRUD) {

    return {
      get: getAllResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource
    };

    function createResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.create(resource)
            .then(function(resources) {
              Help.log('resource service: successfully created resource', resources);
              return resources;
            })
            .then(function(resources) {
              Cache.create(resources)
                .then(function(resources) {
                  resolve(resources); // TODO what is resolved here? resources? resource? nothing?
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              Help.warn('resource service: failed creating resource', err);
            });

        } else {
          Outbox.add('create', resource);
        }
      });
    }

    function updateResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.update(resource)
            .then(function(resources) {
              Help.log('resource service: successfully updated resource', resources);
              return resources;
            })
            .then(function(resources) {
              Cache.update(resources)
                .then(function(resources) {
                  resolve(resources); // TODO what is resolved here? resources? resource? nothing?
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              Help.warn('resource service: failed updating resource', err);
            });

        } else {
          Outbox.add('update', resource);
        }
      });
    }

    function destroyResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.destroy(resource)
            .then(function(response) {
              Help.log('resource service: successfully destroyed resource', response);
              return response;
            })
            .then(function(resources) {
              Cache.destroy(resources)
                .then(function(resources) {
                  resolve(resources); // TODO what is resolved here? resources? resource? nothing?
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              Help.warn('resource service: failed destroying resource', err);
            });

        } else {
          Outbox.add('update', resource);
        }
      });
    }

    function getAllResources() {
      return $q(function(resolve, reject) {
        Cache.get().then(function(response) {
            resolve(response);
            Help.log('resource service: successfully got all resources', response);
          })
          .catch(function(err) {
            reject(err);
            Help.warn('resource service: failed getting all resources', err);
          });
      });
    }

  }

}());

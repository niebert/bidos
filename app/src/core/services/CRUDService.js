/* global angular, _ */

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
      destroy: destroyResource,
    };

    function getResources() {
      var url = [config.app.API, config.app.RESOURCE_PATH, config.app.DEFAULT_RESOURCE].join('/');
      return $q(function(resolve) {
        $http.get(url)
          .success(function(response) {
            resolve(response);
            Help.toast('Resource erfolgreich geholt');
          })
          .error(function(response) {
            resolve(response);
          });
      });
    }

    function createResource(resource) {
      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type].join('/');
      return $q(function(resolve) {

        delete resource.type;
        resource.author_id = $rootScope.auth.id;

        $http.post(url, resource)
          .success(function(response) {
            resolve(response);
            Help.toast('Resource erfolgreich erstellt');
            console.log('%cget resource ok', 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            Help.toast(error[0].content.detail); // FIXME
            console.warn('%cget resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
          });
      });
    }

    function updateResource(resource) {
      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve) {

        delete resource.type;
        resource.author_id = $rootScope.auth.id;

        $http.patch(url, resource)
          .success(function(response) {
            var r = response[0]; // gets resource type from first of response array
            data[r.type + 's'].splice(_.findIndex(data[r.type + 's'], { // pluralize
              id: r.id
            }), 1, r);

            prepareResources();

            resolve(response);
            Help.toast('Resource erfolgreich aktualisiert');
            console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            Help.toast(error[0].content.detail); // FIXME
            console.warn('%cupdate resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
          });
      });
    }

    function destroyResource(resource) {
      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve) {
        $http.delete(url)
          .success(function(response) {
            var r = response[0]; // gets resource type from first of response array
            data[r.type + 's'].splice(_.findIndex(data[r.type + 's'], { // pluralize
              id: r.id
            }), 1);

            prepareResources();

            resolve(response);
            Help.toast('Resource erfolgreich gelöscht');
            console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            Help.toast(error[0].content.detail); // FIXME
            console.warn('%cdestroy resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
          });
      });
    }
  }

}());

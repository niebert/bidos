(function() {
  'use strict';
  /* globals angular, _ */

  angular.module('bidos')
    .service('Outbox', OutboxService);

  function OutboxService($rootScope, $q, CRUD, Cache, Help) {

    const VERSION = 1;
    const DATABASE_NAME = 'bidos_development';
    const OBJECTSTORE_NAME = 'outbox';

    return {
      add: addResource, // add resource to outbox
      remove: removeResource, // remove resource from outbox
      push: pushResources // push resources to back end
    };

    function addResource(resource) {

      // store the db operation (create, update, destroy) inside of the
      // resource as well as other stuff we'd like to remember and put the
      // resource into our outbox IndexedDB

      debugger

    }

    function removeResource(resource) {

      debugger

    }

    function pushResources() {
      if ($rootScope.online) {

        // get resources from database TODO
        var resources;

        // must store the operation somewhere, to remember what to do with
        // resources in the outbox TODO
        var op = resources.op;

        _.each(resources, function(resource) {
          CRUD[op](resource).then(function(response) {
            Help.warn('Successfully pushed outbox resource to back end');
            Cache.add(response);
          }).catch(function(err) {
            Help.warn('Failure pushing outbox resource to back end', err);
          });
        });

      }
    }

  }
}());

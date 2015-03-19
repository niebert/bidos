(function() {
  'use strict';
  /* globals angular, Dexie, _ */

  angular.module('bidos')
    .service('Outbox', OutboxService);

  function OutboxService($q, CRUD, CONFIG) {

    const VERSION = 1;
    const DATABASE_NAME = [CONFIG.name, 'outbox', process.env.NODE_ENV].join('_');
    const OUTBOX_TABLE = 'outbox';

    let db = new Dexie(DATABASE_NAME);

    init();

    return {
      init: init,
      add: add,
      get: get,
      sync: sync,
      remove: remove
    };


    function remove(id) {
      console.time('[outbox] removing successfully pushed outbox item');

      if (!db.open()) {
        db.open();
      }

      return $q(function(resolve, reject) {
        db.on('ready', function() {

          db.table('outbox').delete(id).then(function() {
            resolve();
          }).catch(function() {
            reject();
          });

          resolve();
          console.timeEnd('[outbox] removing successfully pushed outbox item');
        });
      });
    }

    function sync() {
      console.time('[outbox] push outbox items to server');

      // must be opened to read from it
      // must be closed to write schema
      if (!db.open()) {
        db.open();
      }

      return $q(function(resolve) {
        db.on('ready', function() {

          _.each(db.outbox.toArray(), function(outboxItem) {
            CRUD[outboxItem.operation](outboxItem.resource);
          });

          resolve();
          console.timeEnd('[cache] push outbox items to server');
        });
      });
    }

    function get() {
      console.time('[cache] get all data from cache');

      // must be opened to read from it
      // must be closed to write schema
      if (!db.open()) {
        db.open();
      }

      return $q(function(resolve) {
        db.on('ready', function() {
          resolve(db.outbox.toArray());
          console.timeEnd('[cache] get all data from cache');
        });
      });
    }

    function init() {
      let schema = {
        [OUTBOX_TABLE]: '++id, operation, resource, date'
      };

      db.version(VERSION).stores(schema);

      if (!db.open()) {
        db.open();
      }

      console.log('[outbox] outbox initialized');
    }

    function add(operation, resource) {
      return $q(function(resolve, reject) {
        db.transaction('rw', db.outbox, function() {

          db.outbox.add({
            operation: operation,
            resource: resource,
            date: Date()
          });

        }).then(function() {

          resolve();
          console.log('[outbox] operation added to outbox');

        }).catch(function() {

          reject();

        });
      });

    }

  }
}());

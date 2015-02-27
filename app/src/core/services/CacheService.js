(function() {
  'use strict';
  /* globals angular, Dexie, pluralize, _ */

  angular.module('bidos')
    .service('Cache', CacheService);

  function CacheService($rootScope, $q) {

    const VERSION = 1;
    const DATABASE_NAME = 'bidos_development';

    let db = new Dexie(DATABASE_NAME);

    // data Obj -> resources Arr -> resource Obj

    // the keyword **resources** is only used in _.someFunc(data,
    // function(resources) { ...

    return {
      init: initCache,
      get: getAllResourcesFromCache,
      add: addResourceToCache,
      update: updateResourcesInCache,
      destroy: destroyResourcesInCache
    };

    function initCache(data) {

      if ($rootScope.network === 'offline') {
        console.error('can not init, offline');
        return;
      }

      // we kill existing dbs!
      db.delete().then(function() {
        console.log('[cache] deleted existing database');
        defineSchema(data);
        populateDatabase(data);

        if (!db.open()) {
          db.open();
        }

      }).catch(function(err) {
        console.log('[cache] could not delete existing database', err);
      });
    }

    // √
    // generate schema from first object of every resource
    function defineSchema(data) {
      console.time('[cache] defining database schema');
      let schema = _.mapValues(data, function(resources) {
        return '++' + _.keys(resources[0]).join(',');
      });

      db.version(VERSION).stores(schema);
      console.timeEnd('[cache] defining database schema');
    }

    // √
    // flat crud json to indexeddb here, exciting ^^
    function populateDatabase(data) {
      console.time('[cache] populating database');
      _.each(data, function(resources, key) {
        db.transaction('rw', db[key], function() {
          _.each(resources, function(resource) {
            db[key].add(resource);
          });
        });
      });
      console.timeEnd('[cache] populating database');
    }

    // √
    function getAllResourcesFromCache() {
      console.time('[cache] get all data from cache');

      // must be opened to read from it
      // must be closed to write schema
      if (!db.open()) {
        db.open();
      }

      return $q(function(resolve) {
        db.on('ready', function() {

          let data = {};
          _.each(db.tables, function(table) {
            data[table.name] = table.toArray();
          });

          $q.all(data).then(function(data) {
            resolve(data);
            console.timeEnd('[cache] get all data from cache');
          });
        });
      });
    }

    // √
    function addResourceToCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {

          let key = pluralize(resource.type);

          db.table(key).add(resource).then(function() {
            getAllResourcesFromCache().then(function(data) {
              resolve(data);
            });
          }).catch(function(err) {
            reject(err);
          });

        });
      });
    }

    // √
    function updateResourcesInCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {

          let key = pluralize(resource.type);

          db.table(key).update(resource.id, resource).then(function(updated) {
            if (updated) {
              getAllResourcesFromCache().then(function(data) {
                resolve(data);
              });
            } else {
              reject();
            }
          });

        });
      });
    }

    // √
    function destroyResourcesInCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {

          let key = pluralize(resource.type);

          db.table(key).delete(resource.id).then(function() {
            getAllResourcesFromCache().then(function(data) {
              resolve(data);
            });
          }).catch(function() {
            reject();
          });

        });
      });
    }

  }
}());

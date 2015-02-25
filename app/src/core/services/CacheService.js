(function() {
  'use strict';
  /* globals angular, Dexie, pluralize, _ */

  angular.module('bidos')
    .service('Cache', CacheService);

  function CacheService($rootScope, $q, CRUD, Help) {

    const VERSION = 1;
    const DATABASE_NAME = 'bidos_development';

    var db = new Dexie(DATABASE_NAME);

    init();

    // data Obj -> resources Arr -> resource Obj

    // the keyword **resources** is only used in _.someFunc(data,
    // function(resources) { ... cases

    return {
      get: getAllResourcesFromCache,
      // create: createResource,
      // update: updateResource,
      // destroy: destroyResource
    };

    // autogenerate schema from keys
    function init() {

      if ($rootScope.offline) {
        console.warn('OFFLINE! SORRY! WILL NOT INIT!');
        return;
      }

      CRUD.get()
        .then(function(data) {
          defineSchema(data);
          populateDatabase(data);
        }).catch(function() {
          Help.warn('CRUD.get() failure: could not initialize database');
        }).finally(function() {
          openDB();
        });
    }

    function openDB() {
      return $q(function(resolve, reject) {
        if (!db.open()) {
          db.open()
            .then(function(d) {
              resolve(d);
              Help.log('database is now open');
            }).catch(function(err) {
              reject(err);
              Help.warn('could not open database');
            });
        }
      });
    }

    // √
    // generate schema from first object of every resource
    function defineSchema(data) {
      console.time('defining database schema');
      var schema = _.mapValues(data, function(resources) {
        return '++' + _.keys(resources[0]).join(',');
      });

      db.version(VERSION).stores(schema);
      console.timeEnd('defining database schema');
    }

    // √
    // flat crud json to indexeddb here, exciting ^^
    function populateDatabase(data) {
      console.time('populating database');
      _.each(data, function(resources, key) {
        db.transaction('rw', db[key], function() {
          _.each(resources, function(resource) {
            db[key].add(resource);
          });
        });
      });

      console.timeEnd('populating database');
    }

    // √
    function getAllResourcesFromCache() {
      console.time('get all data from cache');
      return $q(function(resolve) {
        db.on('ready', function() {

          var data = {};
          _.each(db.tables, function(table) {
            data[table.name] = table.toArray();
          });

          $q.all(data).then(function(data) {
            resolve(prepare(data));
            console.timeEnd('get all data from cache');
          });
        });
      });
    }

    // TODO inside of linkResources the naming is correct. out here it is not.

    // link to ref and back
    function prepare(data) {
      console.time('prepare cached data');

      // key is plural / resources are selected by key
      // type is singular / a resource has a type

      _.each(data, function(resources, _key) { // type is PLURAL

        // key is the pluralized type of the resource
        let key = _key; // TODO why is this neccessary?

        _.each(resources, function(resource, resourceIdx, resources) {

          // convert string dates to real dates
          _.each(resource, function(val, key, resource) {
            if (/_at/.test(key) && (Object.prototype.toString.call(val) !== '[object Date]')) {
              resource[key] = new Date(resource[key]);
            }
          });

          // pick k/v-pairs that reference another resource (n.b. test is
          // faster than match -- http://stackoverflow.com/q/10940137/220472)
          var refs = _.pick(resource, function(refId, refKey) {
            return /_id/.test(refKey) && refId; // no null
          });

          if (_.size(refs)) {
            _.each(refs, function(refId, _refKey) {

              // TODO compare to refKey.split('_')[0]
              let refKey = pluralize(_refKey.slice(0, -3));
              let ref = _.filter(data[refKey], {
                id: refId
              })[0];

              // link to ref <3 √
              if (!resource.hasOwnProperty(resource.type)) {
                Object.defineProperty(resource, ref.type, {
                  get: function() {
                    return ref;
                  }
                });
              }

              // NOTE there are two sings plural around here: the keys in the
              // data object and each getter to the children of a resource.
              // both are somehow similar i guess.

              // link to children √ we create a prop on the referenced
              // resource and link back here (reverse ref)
              if (!ref.hasOwnProperty(key)) {
                Object.defineProperty(ref, key, { // key is PLURAL: children
                  get: function() {
                    let children = _.filter(resources, {
                      [ref.type + '_id']: ref.id
                    });
                    return children;
                  }
                });
              }

            });
          }
        });
      });

      console.timeEnd('prepare cached data');
      return data;

    }
  }
}());

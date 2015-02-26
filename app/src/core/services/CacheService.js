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
      create: createResourcesInCache,
      update: updateResourceInCache,
      destroy: destroyResourceInCache
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

      addItemHandlers(data);
      addObservationHandlers(data);
      addKidHandlers(data);
      addGroupHandlers(data);
      addInstitutionHandlers(data);
      addUserHandlers(data);

      console.timeEnd('prepare cached data');
      return data;
    }

    function addItemHandlers(data) {
      _.each(data.items, function(item) {

        // the next two require the item to have the get behaviours property
        // to be set

        if (!item.hasOwnProperty('examples')) {
          Object.defineProperty(item, 'examples', {
            get: function() {
              return _.chain(this.behaviours)
                .map('examples')
                .flatten()
                .value();
            }
          });
        }

        if (!item.hasOwnProperty('ideas')) {
          Object.defineProperty(item, 'ideas', {
            get: function() {
              return _.chain(this.behaviours)
                .map('ideas')
                .flatten()
                .value();
            }
          });
        }

      });
    }

    function addObservationHandlers(data) {
      _.each(data.observations, function(observation) {
        if (!observation.hasOwnProperty('behaviour')) {
          Object.defineProperty(observation, 'behaviour', {
            get: function() {
              return _.filter(this.item.behaviours, {
                niveau: this.niveau
              })[0];
            }
          });
        }
      });
    }

    function addKidHandlers(data) {
      _.each(data.kids, function(kid) {
        if (!kid.hasOwnProperty('skill')) {
          Object.defineProperty(kid, 'skill', {
            get: function() {
              var skill = [
                _.chain(kid.observations).filter({
                  domain_id: 1
                }).map('niveau').reduce(function(sum, n) {
                  return sum + n;
                }, 0).value(),
                _.chain(kid.observations).filter({
                  domain_id: 2
                }).map('niveau').reduce(function(sum, n) {
                  return sum + n;
                }, 0).value(),
                _.chain(kid.observations).filter({
                  domain_id: 3
                }).map('niveau').reduce(function(sum, n) {
                  return sum + n;
                }, 0).value(),
                _.chain(kid.observations).filter({
                  domain_id: 4
                }).map('niveau').reduce(function(sum, n) {
                  return sum + n;
                }, 0).value()
              ];
              return skill;
            }
          });
        }

        if (!kid.hasOwnProperty('age')) {
          Object.defineProperty(kid, 'age', {
            get: function() {
              var today = new Date();
              var birthDate = this.bday;
              var age = today.getFullYear() - birthDate.getFullYear();
              var m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              return age;
            }
          });
        }
      });
    }

    function addGroupHandlers(data) {
      _.each(data.groups, function(group) {
        if (!group.hasOwnProperty('observations')) {
          Object.defineProperty(group, 'observations', {
            get: function() {
              return _.chain(group.kids)
                .map('observations')
                .filter(function(d) {
                  return d.length;
                })
                .value();
            }
          });
        }
      });
    }

    function addInstitutionHandlers(data) {

      _.each(data.institutions, function(institution) {
        if (!institution.hasOwnProperty('observations')) {
          Object.defineProperty(institution, 'observations', {
            get: function() {
              return _.chain(institution.groups)
                .map('kids')
                .flatten()
                .map('observations')
                .filter(function(d) {
                  return d.length;
                })
                .value();
            }
          });
        }
      });
    }

    function addUserHandlers(data) {

      _.each(data.users, function(user) {
        if (!user.hasOwnProperty('kids')) {
          Object.defineProperty(user, 'kids', {
            get: function() {
              return _.chain(user.groups)
                .map('kids')
                .flatten()
                .value();
            }
          });
        }
        if (!user.hasOwnProperty('roleName')) {
          Object.defineProperty(user, 'roleName', {
            get: function() {
              switch (this.role) {
                case 0:
                  return 'admin';
                case 1:
                  return 'practitioner';
                case 2:
                  return 'scientist';
              }
            }
          });
        }
      });
    }

    function makeRoleModifications(data) {
      switch ($rootScope.auth.role) {

        // ADMIN
        case 0:
          break;

          // PRACTITIONER
        case 1:
          // put user specific kids and group resources on top scope level
          data.kids = _.flatten(_.chain(data.users)
            .filter({
              id: $rootScope.auth.id
            })
            .first()
            .value()
            .institution.groups.map(function(d) {
              return d.kids;
            }));

          data.groups = _.flatten(_.chain(data.users)
            .filter({
              id: $rootScope.auth.id
            })
            .first()
            .value()
            .institution.groups);

          // data.observations = _.flatten(_.chain(data.users)
          //   .filter({
          //     id: $rootScope.auth.id
          //   })
          //   .first()
          //   .value()
          //   .institution.groups);

          break;

        case 2:
          _.each(data.kids, function(k) {
            var f = k.name.split(' ')[0]; // first name
            k.name = f[0] + f[1] + f[f.length - 1] + k.id; // <3
            console.log(k.name);
          });
          // debugger
          break;
      }
    }

    function createResourcesInCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {
          let key = pluralize(resource.type);
          db[key].add(resource).then(function(response) {
            resolve(response);
          }).catch(function(err) {
            reject(err);
          });
        });
      });
    }

    function updateResourceInCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {
          let key = pluralize(resource.type);
          db[key].update(resource.id, resource).then(function(updated) {
            if (updated) {
              resolve(resource);
            } else {
              reject();
            }
          });
        });
      });
    }

    function destroyResourceInCache(resources) {
      return $q(function(resolve, reject) {
        _.each(resources, function(resource) {
          let key = pluralize(resource.type);
          db[key].delete(resource.id).then(function() {
            resolve(resource);
          }).catch(function() {
            reject();
          });
        });
      });
    }

  }
}());

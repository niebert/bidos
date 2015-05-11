(function() {
  'use strict';
  /* globals angular, _, pluralize */

  angular.module('bidos')
    .service('Resources', ResourceService);

  function ResourceService($rootScope, $q, CRUD, Cache, Outbox) {

    var preparedData = preparedData || null;

    return {
      sync: syncResources,
      get: getAllResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource
    };

    function syncOutbox() {
      return $q(function(resolve) {
        Outbox.get().then(function(outbox) {

          var promises = [];

          _.each(outbox, function(outboxItem) {

            CRUD[outboxItem.operation](outboxItem.resource).then(function(response) {
              console.log('successfully pushed resource to server', response);
              Outbox.remove(outboxItem.id);
            }).catch(function(err) {
              console.warn('pushing resource to server was not successful', outboxItem, err[0].content.detail);
            });

          });

          $q.all(promises).then(function() {

            Outbox.get().then(function(outboxItems) {
              resolve(outboxItems);
            });
          });

        });
      });
    }

    function syncResources() {
      return $q(function(resolve, reject) {
        syncOutbox().finally(function() {
          CRUD.get()
            .then(function(data) {
              Cache.init(data);
              preparedData = prepare(data);
              resolve();
              console.log('[resources] got resources from crud');
            }).catch(function() {
              reject();
              console.warn('[resources] could not get resources from crud');
            });
        });
      });
    }

    function initResources() {
      return $q(function(resolve, reject) {

        if ($rootScope.network === 'online') {
          console.time('[resources] online, got resources from crud');
          // if online, get all data from api and (a) store it to cache and
          // (b) prepare it and make it available as preparedData

          CRUD.get()
            .then(function(data) {
              console.timeEnd('[resources] online, got resources from crud', data);

              Cache.init(data); // this will delete existing indexeddbs and create them anew
              preparedData = prepare(data);
              resolve(preparedData);

              console.log('[resources] resolving prepared data');
            }).catch(function() {
              console.warn('[resources] could not get resources from crud');

              reject();

            });
        } else {
          console.time('[resources] offline, got resources from cache');
          // if offline, get all data from cache and make it available as
          // preparedData. same thing as being online, but w/o storing
          // anything to the cache (TODO refactor).

          Cache.get()
            .then(function(data) {
              console.timeEnd('[resources] offline, got resources from cache');

              preparedData = prepare(data);
              resolve(preparedData);

            }).catch(function() {

              reject();

              console.warn('[resources] could not get resources from cache');
            });

        }

      });
    }

    // TODO there are two ways to push data to the back end, either put it in
    // the outbox and clear that outbox everytime, or just do the outbox thing
    // when we're offline, else just regularily go w/ the crud service

    function createResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.create(resource)
            .then(function(resources) {
              console.log('[resources] successfully created resource', resources);
              return resources;
            })
            .then(function(resources) {
              Cache.add(resources)
                .then(function(data) {
                  preparedData = prepare(data);
                  resolve(resources);// TODO why not resolve(preparedData); ???
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              console.warn('[resources] failed creating resource', err);
            });

        } else {
          Outbox.add('create', resource);
          Cache.add([resource]).then(function(data) { // mind the array!
            preparedData = prepare(data);
            resolve(preparedData);
          });
        }
      });
    }

    function updateResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.update(resource)
            .then(function(resources) {
              console.log('[resources] successfully updated resource', resources);
              return resources;
            })
            .then(function(resources) {
              Cache.update(resources)
                .then(function(data) {
                  preparedData = prepare(data);
                  resolve(preparedData);
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              console.warn('[resources] failed updating resource', err);
            });

        } else {
          Outbox.add('update', resource);
          Cache.update([resource]).then(function(data) { // mind the array!
            preparedData = prepare(data);
            resolve(preparedData);
          });
        }
      });
    }

    function destroyResource(resource) {
      return $q(function(resolve, reject) {
        if ($rootScope.network === 'online') {

          CRUD.destroy(resource)
            .then(function(response) { // NOTE response is not a full resource, just type and id
              console.log('[resources] successfully destroyed resource', response);
              return response;
            })
            .then(function(response) {
              Cache.destroy(response)
                .then(function(data) {
                  preparedData = prepare(data);
                  resolve(preparedData);
                }).catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
              console.warn('[resources] failed destroying resource', err);
            });

        } else {
          Outbox.add('destroy', resource); // TODO add op 'DELETE'
          Cache.destroy([resource]).then(function(data) { // mind the array!
            preparedData = prepare(data);
            resolve(preparedData);
          });
        }
      });
    }

    function getAllResources() {
      return $q(function(resolve, reject) {
        if (preparedData) {
          resolve(preparedData);
          console.log('[resources] preparedData available and ready');
          // just get the already prepared data model w/o any further actions
        } else {
          console.warn('[resource] preparedData is not ready. please wait ...'); // TODO check this data loading s/t very slow
          initResources().then(function(preparedData) {
            resolve(preparedData);
          }).catch(function(err) {
            reject(err);
          });
        }
      });
    }

    // TODO inside of prepare the naming is correct. out here it is mostly not.

    // link to ref and back
    function prepare(data) {
      console.time('[resource] prepare data');

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

          // convert string dates to real dates
          _.each(resource, function(val, key, resource) {
            if (/bday/.test(key) && (Object.prototype.toString.call(val) !== '[object Date]')) {
              resource[key] = new Date(resource[key]);
            }
          });

          // pick k/v-pairs that reference another resource (n.b. test is
          // faster than match -- http://stackoverflow.com/q/10940137/220472)
          var refs = _.pick(resource, function(refId, refKey) {
            return /_id/.test(refKey) && refId; // no null
          });

          if (/*true*/ _.size(refs)) {
            _.each(refs, function(refId, _refKey) {

              // TODO compare to refKey.split('_')[0]
              let refKey = pluralize(_refKey.slice(0, -3));
              let ref = _.filter(data[refKey], {
                id: refId
              })[0];

              if (!ref) { return; } // TODO check this

              // link to ref <3 √
              if (!resource.hasOwnProperty(resource.type)) {
                Object.defineProperty(resource, ref.type, {
                  get: function() {
                    return ref;

                    // Angular will JSON.parse() this at one point ant throw
                    // circular reference error. So don't do this here (and we
                    // don't need it at all, I guess).
                  }, enumerable: false
                });
              }

              // NOTE there are two things plural around here: the keys in the
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
                  }, enumerable: false
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
      makeRoleModifications(data);

      console.timeEnd('[resource] prepare data');
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
            }, enumerable: false
          });
        }

        if (!item.hasOwnProperty('ideas')) {
          Object.defineProperty(item, 'ideas', {
            get: function() {
              return _.chain(this.behaviours)
                .map('ideas')
                .flatten()
                .value();
            }, enumerable: false
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
            }, enumerable: false
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
            }, enumerable: false
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
            }, enumerable: false
          });
        }

        if (!kid.hasOwnProperty('sexString')) {
          Object.defineProperty(kid, 'sexString', {
            get: function() {
              switch (kid.sex) {
                case 1: return 'männlich';
                case 2: return 'weiblich';
              }
            }, enumerable: false
          });
        }

        if (!kid.hasOwnProperty('groupedObs')) {
          Object.defineProperty(kid, 'groupedObs', {
            get: function() {
              return _.groupBy(kid.observations, function(obs) {
                return obs.item.subdomain.domain.id;
              });
              }, enumerable: false
          });
        }
      });
    }

    function addGroupHandlers(data) {
      _.each(data.groups, function(group) {
        if (!group.hasOwnProperty('observations')) {
          Object.defineProperty(group, 'observations', {
            get: function() {
              return _.chain(group.kids).map('observations').flatten().value();
            }, enumerable: false
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
            }, enumerable: false
          });
        }
      });
    }

    function addUserHandlers(data) {
      _.each(data.users, function(user) {
        // if (!user.hasOwnProperty('kids')) {
        //   Object.defineProperty(user, 'kids', {
        //     get: function() {
        //       return _.chain(user.group)
        //         .map('kids')
        //         .flatten();
        //     }, enumerable: false
        //   });
        // }
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
            }, enumerable: false
          });
        }
      });
    }

    function getUser(resources) {
      return _.filter(resources.users, {
        id: $rootScope.auth.id
      })[0];
    }

    function makeRoleModifications(data) {

      data.me = getUser(data);

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

          // only show the institution the practitioner belongs to

          // TODO allow a practitioner to be part of multiple institutions and
          // groups

          data.institutions = data.institutions.filter(function(institution) {
            return institution.id === data.me.institution_id;
          });

          data.groups = data.groups.filter(function(group) {
            return group.id === data.me.group_id;
          });


          // data.observations = _.filter(data.observations, function(obs) {
          //   return obs.author_id === data.me.id;
          // });

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
            // console.log(k[resources].name);
          });
          break;
      }
    }

  }

}());

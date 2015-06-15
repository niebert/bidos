/* globals angular, _, pluralize */
angular.module('bidos')
  .service('Resources', ResourceService);

function ResourceService($rootScope, $q, CRUD) {

  var resources = resources || null; // not {}!

  return {
    get: get,
    init: init,
    create: create,
    update: update,
    destroy: destroy
  };

  function init() {
    return $q(function (resolve, reject) {
      CRUD.get()
      .then(function (data) {
        prepare(data).then(function (preparedData) {
          addItemHandlers(preparedData);
          addObservationHandlers(preparedData);
          addKidHandlers(preparedData);
          addGroupHandlers(preparedData);
          addInstitutionHandlers(preparedData);
          addUserHandlers(preparedData);
          makeRoleModifications(preparedData);
          resources = preparedData;
          resolve(resources);
        });
      }).catch(function (err) {
        console.warn('failed initializing data', err);
        reject(err);
      });
    });
  }

  function get() {
    return $q(function (resolve) {
      if (resources) {
        resolve(resources);
      } else {
        init().then(function (response) {
          resolve(response);
        });
      }
    });
  }

  function create(resource) {
    return $q(function (resolve, reject) {
      CRUD.create(resource)
      .then(function (response) {
        var r = response[0];
        var bucket = resources[r.type + 's']; // pluralize
        bucket.push(r);
        resources = prepare(resources);
        resolve(r);
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  function update(resource) {
    return $q(function (resolve, reject) {
      CRUD.update(resource)
      .then(function (response) {
        var r = response[0];

        // FIXME! Sometimes `resources` is still a promise! At this point it
        // should be already resolved and if not, we shouldn't be here.

        // if (resources.hasOwnProperty('$$state')) {
        //   resources.then(function(resp) {
        //     resources = resp;
        //   });
        //   debugger;
        // }

        var bucket = resources[r.type + 's']; // pluralize
        bucket.splice(_.findIndex(bucket, {id: r.id}), 1, r);
        resources = prepare(resources);
        resolve(r);
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  function destroy(resource) {
    return $q(function(resolve, reject) {
      CRUD.destroy(resource)
      .then(function(response) { // NOTE response is not a full resource, just type and id
        var r = response[0];
        var bucket = resources[r.type + 's']; // pluralize
        bucket.splice(_.findIndex(bucket, {id: r.id}), 1);
        resources = prepare(resources);
        resolve(r);
      }).catch(function(err) {
        reject(err);
      });
    });
  }

  // TODO inside of prepare the naming is correct. out here it is mostly not.

  // link to ref and back
  function prepare(data) {
    return $q(function(resolve, reject) {
      console.time('[resources] prepare data');

      // key is plural / resources are selected by key
      // type is singular / a resource has a type

      _.each(data, function(resources, _key) { // type is PLURAL

        // key is the pluralized type of the resource
        let key = _key; // TODO why is this neccessary?

        _.each(resources, function(resource) {

          // convert string dates to real dates
          _.each(resource, function(val) {
            if (/_at/.test(key) && (Object.prototype.toString.call(val) !== '[object Date]')) {
              resource[key] = new Date(resource[key]);
            }
          });

          // convert string dates to real dates
          _.each(resource, function(val) {
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
              if (!resource.hasOwnProperty(ref.type)) {
                Object.defineProperty(resource, ref.type, {
                  get: function() {
                    return ref;
                  }});
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

      console.timeEnd('[resources] prepare data');
      resolve(data);
    });
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
                'domain_id': 1
              }).map('niveau').reduce(function(sum, n) {
                return sum + n;
              }, 0).value(),
              _.chain(kid.observations).filter({
                'domain_id': 2
              }).map('niveau').reduce(function(sum, n) {
                return sum + n;
              }, 0).value(),
              _.chain(kid.observations).filter({
                'domain_id': 3
              }).map('niveau').reduce(function(sum, n) {
                return sum + n;
              }, 0).value(),
              _.chain(kid.observations).filter({
                'domain_id': 4
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

            // ugly, sorry

            return [
              _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 1; }),
              _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 2; }),
              _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 3; }),
              _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 4; })
            ];

            // let groupedObs = [];

            // for (let i=1;i<=4;i++) {
            //   groupedObs.push(kdi)
            // }

            // return _.groupBy(kid.observations, function(obs) {
            //   return obs.item.subdomain.domain.id;
            // });

            }, enumerable: false
        });
      }

      if (!kid.hasOwnProperty('lastObservation')) {
        Object.defineProperty(kid, 'lastObservation', {
          get: function() {
            return kid.observations ? kid.observations[kid.observations.length - 1] : null;
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

       // admins do not have kids as they have no groups
      // if (user.role === 0) return;

      // all kids belonging to the same group as the user
      if (!user.hasOwnProperty('kids')) {
        Object.defineProperty(user, 'kids', {
          get: function() {
            return user.group.kids;
          }, enumerable: false
        });
      }

     // all the users observations
      if (!user.hasOwnProperty('observations')) {
        Object.defineProperty(user, 'observations', {
          get: function() {
            return _.filter(data.observations, {
              author_id: $rootScope.me.id
            });
          }, enumerable: false
        });
      }

     // all the users observations (in his/her/silly current group)
      if (!user.hasOwnProperty('observedKids')) {
        Object.defineProperty(user, 'observedKids', {
          get: function() {
            return _.chain($rootScope.me.observations).pluck('kid').uniq().value();
          }, enumerable: false
        });
      }

     // all the users observations (in his/her/silly current group)
      if (!user.hasOwnProperty('observedGroupKids')) {
        Object.defineProperty(user, 'observedGroupKids', {
          get: function() {
            return _.chain($rootScope.me.observations).pluck('kid').uniq().filter({group_id: $rootScope.me.group_id}).value();
          }, enumerable: false
        });
      }

     // all the users observations
      if (!user.hasOwnProperty('groupObservations')) {
        Object.defineProperty(user, 'groupObservations', {
          get: function() {
            return data.observations.filter(function(obs) {
              let myObs = obs.author_id === $rootScope.me.id;
              let myGroup = obs.kid.group_id === $rootScope.me.group_id;
              return _.all([myObs, myGroup]);
            });
          }, enumerable: false
        });
      }

      // the role in text TODO implement proper role system
      if (!user.hasOwnProperty('roleName')) {
        Object.defineProperty(user, 'roleName', {
          get: function() {
            switch (this.role) {
              case 0:
                return 'Administrator';
              case 1:
                return 'Praktiker';
              case 2:
                return 'Wissenschaftler';
            }
          }, enumerable: false
        });
      }

    });
  }

  function getUser(resources) {
    if (!$rootScope.hasOwnProperty('auth')) {
      console.warn('$rootScope has no property auth!');
      return {};
    }
    return _.filter(resources.users, {
      id: $rootScope.auth.id
    })[0];
  }

  function makeRoleModifications(data) {

    data.me = getUser(data);
    // $scope.kids = data.kids.filter(function(kid) {
    //   if (!kid) return false;
    //   return kid.group_id === ($rootScope.me.group_id ? $rootScope.me.group_id : kid.group_id); // admin sees all kids
    // });

    switch (data.me.role) {

      // ADMIN
      case 0:
        break;

        // PRACTITIONER
      case 1:

        // put user specific kids and group resources on top scope level

        // data.kids = _.flatten(_.chain(data.users)
        //   .filter({
        //     id: $rootScope.auth.id
        //   })
        //   .first()
        //   .value()
        //   .institution.groups.map(function(d) {
        //     return d.kids;
        //   }));

        // data.groups = _.flatten(_.chain(data.users)
        //   .filter({
        //     id: $rootScope.auth.id
        //   })
        //   .first()
        //   .value()
        //   .institution.groups);

        // only show the institution the practitioner belongs to

        // TODO allow a practitioner to be part of multiple institutions and
        // groups

        // data.institutions = data.institutions.filter(function(institution) {
        //   return institution.id === data.me.institution_id;
        // });

        // data.groups = data.groups.filter(function(group) {
        //   return group.id === data.me.group_id;
        // });


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
          if (k.anonymized) return;
          var f = k.name.split(' ')[0]; // first name
          k.name = f[0] + f[1] + f[f.length - 1] + k.id; // <3
          k.anonymized = true;
          // console.log(k[resources].name);
        });
        break;
    }
  }

}

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

  // return prepared resource object
  // function prepareResources(resources) {

  //   /* Programatically add getter methods to resource objects. We traverse
  //   /* all resources and look for blabla_id, which refers to the parent id.
  //   /* On the parent we create the getter blablas() then. */

  //   // 1 define get parent functions
  //   // 2 define get children functions

  //   // defineChildrenGetter('institutions', 'groups');
  //   function defineChildrenGetter(outer, inner) {
  //     _.each(resources[outer], function(resource) {
  //       var parentKey = resource.type + '_id';

  //       if (!resource.hasOwnProperty(inner)) {
  //         Object.defineProperty(resource, inner, {
  //           get: function() {
  //             return _.filter(resources[inner], function(d) {
  //               return d[parentKey] === this.id;
  //             }, this);
  //           }
  //         });
  //       }

  //     });
  //   }

  //   _.each(resources, function(resource) {
  //     var p;
  //     _.each(resource, function(resourceObj, resourceIdx) {
  //       p = resourceIdx;
  //       _.each(resourceObj, function(child) {
  //       debugger
  //         var c = child.slice(0, child.lastIndexOf('_id')) + 's';
  //         defineChildrenGetter(c, p);
  //       }.bind(this));
  //     });
  //   });

  //   debugger

  //   // <3
  //   function installParentResourceGetter(data, resources, parentType) {
  //     _.each(resources, function(d) {
  //       if (!d.hasOwnProperty(parentType)) {
  //         Object.defineProperty(d, parentType, {
  //           get: function() {
  //             return _.filter(data[parentType + 's'], {
  //               id: this[parentType + '_id']
  //             })[0];
  //           }
  //         });
  //       }
  //     });
  //   }

  //   // --------------------------------------------------------------------------------

  //   /* TODO: The following two parts work fine but could be refactored to be
  //   /* a little bit more maintainable. */

  //   // --------------------------------------------------------------------------------

  //   // var r = _.map(prepareResources, function(datum, datumKey) {
  //   //   var ddx = {};
  //   //   debugger
  //   //   ddx[datumKey] = _.chain(datum).map(function(d) {
  //   //       return _.chain(d).keys().filter(function(key) {
  //   //         return key.match(/_id$/);
  //   //       }).value();
  //   //     }).flatten().uniq().value();
  //   //   return ddx;
  //   // });

  //   // debugger

  //   _.each(r, function(d) {
  //     var p;
  //     _.each(d, function(v, i) {
  //       p = i;
  //       _.each(v, function(child) {
  //         var c = child.slice(0, child.lastIndexOf('_id')) + 's';
  //         defineChildrenGetter(c, p);
  //       }.bind(this));
  //     });
  //   });

  //   // convert dates to actual date objects
  //   _.each(resources, function(resource) {
  //     _.each(resource, function(r) {
  //       _.each(r, function(value, key, object) {
  //         if (key.match(/_at$/) || key.match(/^bday$/)) {
  //           object[key] = new Date(value);
  //         }
  //       });
  //     });
  //   });

  //   // --------------------------------------------------------------------------------

  //   _.each(data, function(resources) {
  //     var parentTypes = _.chain(resources[0]) // <- beware
  //       .keys()
  //       .filter(function(d) { return d.match(/_id/); })
  //       .map(function(d) { return d.split('_id')[0]; })
  //       .value();

  //       debugger

  //     _.each(parentTypes, function(parentType) {
  //       if (data.hasOwnProperty(parentType + 's')) {
  //         installParentResourceGetter(data, resources, parentType);
  //       }
  //     });
  //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   // the next one requires the get subdomain property to be set on each domain resource
  //   //   _.each(resources.items, function(item) {
  //   //     if (!item.hasOwnProperty('domain')) {
  //   //       Object.defineProperty(item, 'domain', {
  //   //         get: function() {
  //   //           return _.filter(resources.domains, {
  //   //             id: this.subdomain.domain_id
  //   //           })[0];
  //   //         }
  //   //       });
  //   //     }

  //   //     // the next two require the item to have the get behaviours property to be set

  //   //     if (!item.hasOwnProperty('examples')) {
  //   //       Object.defineProperty(item, 'examples', {
  //   //         get: function() {
  //   //           return _.chain(this.behaviours)
  //   //             .map('examples')
  //   //             .flatten()
  //   //             .value();
  //   //         }
  //   //       });
  //   //     }

  //   //     if (!item.hasOwnProperty('ideas')) {
  //   //       Object.defineProperty(item, 'ideas', {
  //   //         get: function() {
  //   //           return _.chain(this.behaviours)
  //   //             .map('ideas')
  //   //             .flatten()
  //   //             .value();
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   _.each(resources.observations, function(observation) {

  //   //     if (!observation.hasOwnProperty('update')) {
  //   //       Object.defineProperty(observation, 'update', {
  //   //         get: function() {
  //   //           return updateResource(this);
  //   //         }
  //   //       });
  //   //     }

  //   //     if (!observation.hasOwnProperty('domain')) {
  //   //       Object.defineProperty(observation, 'domain', {
  //   //         get: function() {
  //   //           return this.item.subdomain.domain;
  //   //         }
  //   //       });
  //   //     }

  //   //     if (!observation.hasOwnProperty('domain_id')) {
  //   //       Object.defineProperty(observation, 'domain_id', {
  //   //         get: function() {
  //   //           return this.item.subdomain.domain.id;
  //   //         }
  //   //       });
  //   //     }

  //   //     if (!observation.hasOwnProperty('behaviour')) {
  //   //       Object.defineProperty(observation, 'behaviour', {
  //   //         get: function() {
  //   //           return _.filter(this.item.behaviours, {
  //   //             niveau: this.niveau
  //   //           })[0];
  //   //         }
  //   //       });
  //   //     }
  //   //     if (!observation.hasOwnProperty('subdomain_id')) {
  //   //       Object.defineProperty(observation, 'subdomain_id', {
  //   //         get: function() {
  //   //           return this.item.subdomain.id;
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   _.each(resources.kids, function(kid) {
  //   //     if (!kid.hasOwnProperty('skill')) {
  //   //       Object.defineProperty(kid, 'skill', {
  //   //         get: function() {
  //   //           var skill = [
  //   //             _.chain(kid.observations)
  //   //             .filter({
  //   //               domain_id: 1
  //   //             })
  //   //             .map('niveau')
  //   //             .reduce(function(sum, n) {
  //   //               return sum + n;
  //   //             }, 0)
  //   //             .value(),
  //   //             _.chain(kid.observations)
  //   //             .filter({
  //   //               domain_id: 2
  //   //             })
  //   //             .map('niveau')
  //   //             .reduce(function(sum, n) {
  //   //               return sum + n;
  //   //             }, 0)
  //   //             .value(),
  //   //             _.chain(kid.observations)
  //   //             .filter({
  //   //               domain_id: 3
  //   //             })
  //   //             .map('niveau')
  //   //             .reduce(function(sum, n) {
  //   //               return sum + n;
  //   //             }, 0)
  //   //             .value(),
  //   //             _.chain(kid.observations)
  //   //             .filter({
  //   //               domain_id: 4
  //   //             })
  //   //             .map('niveau')
  //   //             .reduce(function(sum, n) {
  //   //               return sum + n;
  //   //             }, 0)
  //   //             .value(),
  //   //           ];
  //   //           return skill;
  //   //         }
  //   //       });
  //   //     }

  //   //     if (!kid.hasOwnProperty('age')) {
  //   //       Object.defineProperty(kid, 'age', {
  //   //         get: function() {
  //   //           var today = new Date();
  //   //           var birthDate = this.bday;
  //   //           var age = today.getFullYear() - birthDate.getFullYear();
  //   //           var m = today.getMonth() - birthDate.getMonth();
  //   //           if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //   //             age--;
  //   //           }
  //   //           return age;
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   _.each(resources.groups, function(group) {
  //   //     if (!group.hasOwnProperty('observations')) {
  //   //       Object.defineProperty(group, 'observations', {
  //   //         get: function() {
  //   //           return _.chain(group.kids)
  //   //             .map('observations')
  //   //             .filter(function(d) {
  //   //               return d.length;
  //   //             })
  //   //             .value();
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   _.each(resources.institutions, function(institution) {
  //   //     if (!institution.hasOwnProperty('observations')) {
  //   //       Object.defineProperty(institution, 'observations', {
  //   //         get: function() {
  //   //           return _.chain(institution.groups)
  //   //             .map('kids')
  //   //             .flatten()
  //   //             .map('observations')
  //   //             .filter(function(d) {
  //   //               return d.length;
  //   //             })
  //   //             .value();
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // --------------------------------------------------------------------------------

  //   //   _.each(resources.users, function(user) {
  //   //     if (!user.hasOwnProperty('kids')) {
  //   //       Object.defineProperty(user, 'kids', {
  //   //         get: function() {
  //   //           return _.chain(user.groups)
  //   //             .map('kids')
  //   //             .flatten()
  //   //             .value();
  //   //         }
  //   //       });
  //   //     }
  //   //     if (!user.hasOwnProperty('roleName')) {
  //   //       Object.defineProperty(user, 'roleName', {
  //   //         get: function() {
  //   //           switch (this.role) {
  //   //             case 0:
  //   //               return 'admin';
  //   //             case 1:
  //   //               return 'practitioner';
  //   //             case 2:
  //   //               return 'scientist';
  //   //           }
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   /* ROLE BASED CHANGES TO THE RESOURCE MODEL FIXME SUCKS */

  //   //   switch ($rootScope.auth.role) {

  //   //     // ADMIN
  //   //     case 0:
  //   //       break;

  //   //       // PRACTITIONER
  //   //     case 1:
  //   //       // put user specific kids and groups resources on top scope level
  //   //       resources.kids = _.flatten(_.chain(data.users)
  //   //         .filter({
  //   //           id: $rootScope.auth.id
  //   //         })
  //   //         .first()
  //   //         .value()
  //   //         .institution.groups.map(function(d) {
  //   //           return d.kids;
  //   //         }));

  //   //       resources.groups = _.flatten(_.chain(data.users)
  //   //         .filter({
  //   //           id: $rootScope.auth.id
  //   //         })
  //   //         .first()
  //   //         .value()
  //   //         .institution.groups);

  //   //       // resources.observations = _.flatten(_.chain(data.users)
  //   //       //   .filter({
  //   //       //     id: $rootScope.auth.id
  //   //       //   })
  //   //       //   .first()
  //   //       //   .value()
  //   //       //   .institution.groups);

  //   //       break;

  //   //     case 2:
  //   //       _.each(resources.kids, function(k) {
  //   //         var f = k.name.split(' ')[0]; // first name
  //   //         k.name = f[0] + f[1] + f[f.length - 1] + k.id; // <3
  //   //         console.log(k.name);
  //   //       });
  //   //       // debugger
  //   //       break;
  //   //   }

  //   return resources;
  // }

}());

/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('bxResources', bxResources)
    .service('bxResourceHelper', bxResourceHelper);

  function bxResources($rootScope, $mdToast, $http, $q) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* TODO: The back end should authenticate the user, check for it's group
    /* and respond with the correct resource object the user is allowed to
    /* get, and not more. */

    // if (!$localStorage.hasOwnProperty('data')) {
    //   $localStorage.data = {};
    // } else {
    //   console.log('%LOCAL DATA (PLAIN) FOUND', 'color: green; font-size: 1.2em', $localStorage.data);
    // }

    // if (!$localStorage.hasOwnProperty('resources')) {
    //   $localStorage.resources = {};
    // } else {
    //   console.log('%LOCAL DATA (RESOURCES) FOUND', 'color: green; font-size: 1.2em', $localStorage.resources);
    // }

    // var data = $localStorage.data; // plain server response
    // var resources = $localStorage.resources; // nested resources

    var data = {}; // plain server response
    var resources = {}; // nested resources
    var config = require('../../config');

    var defaultResource = [config.app.API, config.app.RESOURCE_PATH, config.app.DEFAULT_RESOURCE].join('/');

    var toast = function(content) {
      $mdToast.show($mdToast.simple()
        .content(content)
        .position('bottom right')
        .hideDelay(3000));
    };

    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource,
    };

    function prepareResources() {
      /* Programatically add getter methods to resource objects. We traverse
      /* all resources and look for blabla_id, which refers to the parent id.
      /* On the parent we create the getter blablas() then. */

      resources.kids = _.clone(data.kids);
      resources.users = _.clone(data.users);

      // --------------------------------------------------------------------------------

      // nestResource('institutions', 'groups');
      function nestResource(a, b) {
        resources[a] = _.clone(data[a]);
        _.each(resources[a], function(resource) {
          var parentKey = resource.type + '_id';
          if (!resource.hasOwnProperty(b)) {
            Object.defineProperty(resource, b, {
              get: function() {
                return _.filter(data[b], function(d) {
                  return d[parentKey] === this.id;
                }, this);
              }
            });
          }
        });
      }

      // --------------------------------------------------------------------------------

      /* TODO: The following two parts work fine but could be refactored to be
      /* a little bit more maintainable. */

      // --------------------------------------------------------------------------------

      var r = _.map(data, function(datum, datumKey) {
        var ddx = {};
        ddx[datumKey] = _.chain(datum)
          .map(function(d) {
            return _.chain(d)
              .keys()
              .filter(function(key) {
                return key.match(/_id$/);
              })
              .value();
          })
          .flatten()
          .uniq()
          .value();
        return ddx;
      });

      _.each(r, function(d) {
        var p;
        _.each(d, function(v, i) {
          p = i;
          _.each(v, function(child) {
            var c = child.slice(0, child.lastIndexOf('_id')) + 's';
            nestResource(c, p);
          }.bind(this));
        });
      });

      // convert dates to actual date objects
      _.each(resources, function(resource) {
        _.each(resource, function(r) {
          _.each(r, function(value, key, object) {
            if (key.match(/_at$/) || key.match(/^bday$/)) {
              object[key] = new Date(value);
            }
          });
        });
      });

      // --------------------------------------------------------------------------------

      // <3
      function installParentResourceGetter(data, resources, parentType) {
        _.each(resources, function(d) {
          if (!d.hasOwnProperty(parentType)) {
            Object.defineProperty(d, parentType, {
              get: function() {
                return _.filter(data[parentType + 's'], {
                  id: this[parentType + '_id']
                })[0];
              }
            });
          }
        });
      }

      _.each(data, function(resources) {
        var parentTypes = _.chain(resources[0]) // <- beware
          .keys()
          .filter(function(d) {
            return d.match(/_id/);
          })
          .map(function(d) {
            return d.split('_id')[0];
          })
          .value();

        _.each(parentTypes, function(parentType) {
          if (data.hasOwnProperty(parentType + 's')) {
            installParentResourceGetter(data, resources, parentType);
          }
        });
      });

      // --------------------------------------------------------------------------------

      // the next one requires the get subdomain property to be set on each domain resource

      _.each(resources.items, function(item) {
        if (!item.hasOwnProperty('domain')) {
          Object.defineProperty(item, 'domain', {
            get: function() {
              return _.filter(resources.domains, {
                id: this.subdomain.domain_id
              })[0];
            }
          });
        }

        // the next two require the item to have the get behaviours property to be set

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

      // --------------------------------------------------------------------------------

      _.each(resources.observations, function(observation) {

        if (!observation.hasOwnProperty('update')) {
          Object.defineProperty(observation, 'update', {
            get: function() {
              return updateResource(this);
            }
          });
        }

        if (!observation.hasOwnProperty('domain')) {
          Object.defineProperty(observation, 'domain', {
            get: function() {
              return this.item.subdomain.domain;
            }
          });
        }

        if (!observation.hasOwnProperty('domain_id')) {
          Object.defineProperty(observation, 'domain_id', {
            get: function() {
              return this.item.subdomain.domain.id;
            }
          });
        }

        if (!observation.hasOwnProperty('behaviour')) {
          Object.defineProperty(observation, 'behaviour', {
            get: function() {
              return _.filter(this.item.behaviours, {
                niveau: this.niveau
              })[0];
            }
          });
        }
        if (!observation.hasOwnProperty('subdomain_id')) {
          Object.defineProperty(observation, 'subdomain_id', {
            get: function() {
              return this.item.subdomain.id;
            }
          });
        }

      });

      // --------------------------------------------------------------------------------

      _.each(resources.kids, function(kid) {
        if (!kid.hasOwnProperty('skill')) {
          Object.defineProperty(kid, 'skill', {
            get: function() {
              var skill = [
                _.chain(kid.observations)
                .filter({
                  domain_id: 1
                })
                .map('niveau')
                .reduce(function(sum, n) {
                  return sum + n;
                }, 0)
                .value(),
                _.chain(kid.observations)
                .filter({
                  domain_id: 2
                })
                .map('niveau')
                .reduce(function(sum, n) {
                  return sum + n;
                }, 0)
                .value(),
                _.chain(kid.observations)
                .filter({
                  domain_id: 3
                })
                .map('niveau')
                .reduce(function(sum, n) {
                  return sum + n;
                }, 0)
                .value(),
                _.chain(kid.observations)
                .filter({
                  domain_id: 4
                })
                .map('niveau')
                .reduce(function(sum, n) {
                  return sum + n;
                }, 0)
                .value(),
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

      // --------------------------------------------------------------------------------

      _.each(resources.groups, function(group) {
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

      // --------------------------------------------------------------------------------

      _.each(resources.institutions, function(institution) {
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


      // --------------------------------------------------------------------------------

      _.each(resources.users, function(user) {
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
        // if (!user.hasOwnProperty('roleName')) {
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
        // }
      });



      /* ROLE BASED CHANGES TO THE RESOURCE MODEL FIXME SUCKS */

      switch ($rootScope.auth.role) {

        // ADMIN
        case 0:
          break;

          // PRACTITIONER
        case 1:
          // put user specific kids and groups resources on top scope level
          resources.kids = _.flatten(_.chain(data.users)
            .filter({
              id: $rootScope.auth.id
            })
            .first()
            .value()
            .institution.groups.map(function(d) {
              return d.kids;
            }));

          resources.groups = _.flatten(_.chain(data.users)
            .filter({
              id: $rootScope.auth.id
            })
            .first()
            .value()
            .institution.groups);

          // resources.observations = _.flatten(_.chain(data.users)
          //   .filter({
          //     id: $rootScope.auth.id
          //   })
          //   .first()
          //   .value()
          //   .institution.groups);

          break;

        case 2:
          _.each(resources.kids, function(k) {
            var f = k.name.split(' ')[0]; // first name
            k.name=f[0] + f[1] + f[f.length-1] + k.id; // <3
            console.log(k.name);
          });
          // debugger
          break;
      }
    }

    // TODO sucks. we the outer scope flat data model to the
    // response value diretly, but the outer resource model is set
    // by a separate function
    function updateData(response) {
      data = response;
      prepareResources();
    }

    function getResources(sync) {
      return $q(function(resolve) {

        // load resources only once, except when explicitly setting sync to something true
        if (_.isEmpty(data) || sync) {

          $http.get(defaultResource)
            .success(function(response) {
              updateData(response);
              resolve(resources);
            });
        } else {
          resolve(resources);
        }
      });
    }

    function usernameFromEmail(resource) {
      return resource.email.split('@')[0];
    }

    function createResource(resource) {
      var url = [config.app.API, config.app.RESOURCE_PATH, resource.type].join('/');
      return $q(function(resolve) {

        if (resource.type === 'user') {
          resource.username = usernameFromEmail(resource);
          debugger
        }

        delete resource.type;
        resource.author_id = $rootScope.auth.id;

        $http.post(url, resource)
          .success(function(response) {
            _.each(response, function(d) {
              data[d.type + 's'].push(d);
            });

            prepareResources();

            resolve(response);
            toast('Resource erfolgreich erstellt');
            console.log('%cget resource ok', 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            toast(error[0].content.detail); // FIXME
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
            toast('Resource erfolgreich aktualisiert');
            console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            toast(error[0].content.detail); // FIXME
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
            toast('Resource erfolgreich gelöscht');
            console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
          })
          .error(function(error) {
            resolve(error);
            toast(error[0].content.detail); // FIXME
            console.warn('%cdestroy resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
          });
      });
    }

  }

  function bxResourceHelper(bxResources) {

    var resources = null; // datamodel

    if (!resources) {
      bxResources.get()
        .then(function(data) {
          resources = data;
        });
    }

    return {
      countKids: countKids,
      subdomainTitle: subdomainTitle,
      institutionName: institutionName,
      domainTitle: domainTitle,
      group: group,
      institution: institution
    };

    function countKids(groupId) {
      return _.select(resources.kids, {
          group_id: +groupId
        })
        .length;
    }

    function institutionName(institutionId) {
      var institutions = _.select(resources.institutions, {
        id: +institutionId
      });
      if (institutions.length) {
        return institutions[0].name;
      }
    }

    function group(resource) {
      var groups = _.select(resources.groups, {
        id: +resource.group_id
      });
      if (groups.length) {
        return groups[0];
      }
    }

    function institution(resource) {
      var institutionId = resource.institution_id || this.group(resource);

      if (institutionId) {
        return this.institutionName(institutionId);
      }
    }

    function subdomainTitle(subdomainId) {
      var subdomains = _.select(resources.subdomains, {
        id: +subdomainId
      });
      if (subdomains.length) {
        return subdomains[0].title;
      }
    }

    function domainTitle(resource) {
      if (resource.hasOwnProperty('subdomain_id')) {
        var domainId = _.select(resources.subdomains, {
          id: resource.subdomain_id
        })[0].domain_id;

        return _.select(resources.domains, {
          id: +domainId
        })[0].title;
      }
    }

  }

}());

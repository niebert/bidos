/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('ResourceService', ResourceService);

  function ResourceService($rootScope, $mdToast, $http, $q) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* TODO: The back end should authenticate the user, check for it's group
    /* and respond with the correct resource object the user is allowed to
    /* get, and not more. */

    var data = {}; // server response
    var resources = {}; // nested resources
    var RESOURCE_PATH = 'v1';
    var DEFAULT_RESOURCE = 'resources/vanilla';

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

      /* TODO: The following two parts work fine but could be refactored to be
      /* a little bit more maintainable. */

      resources.kids = _.clone(data.kids);
      resources.users = _.clone(data.users);



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

      _.each(resources.subdomains, function(subdomain) {
        if (!subdomain.hasOwnProperty('domain')) {
          Object.defineProperty(subdomain, 'domain', {
            get: function() {
              return _.filter(resources.domains, {
                id: this.domain_id
              })[0];
            }
          });
        }
      });

      _.each(resources.items, function(item) {
        if (!item.hasOwnProperty('subdomain')) {
          Object.defineProperty(item, 'subdomain', {
            get: function() {
              return _.filter(resources.subdomains, {
                id: this.subdomain_id
              })[0];
            }
          });
        }

        if (!item.hasOwnProperty('domain')) {
          Object.defineProperty(item, 'domain', {
            get: function() {
              return _.filter(resources.domains, {
                id: this.subdomain.domain_id
              })[0];
            }
          });
        }

        if (!item.hasOwnProperty('domain')) {
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
      });
    }

    function getResources(sync) {
      var url = [RESOURCE_PATH, DEFAULT_RESOURCE].join('/');
      return $q(function(resolve) {
        if (_.isEmpty(data) || sync) {
          $http.get(url)
            .success(function(response) {
              data = response;
              prepareResources();
              resolve(resources);
              console.info(resources);
            });
        } else {
          resolve(resources);
        }
      });
    }

    function createResource(resource) {
      var url = [RESOURCE_PATH, resource.type].join('/');
      return $q(function(resolve) {

        delete resource.type;
        resource.author_id = $rootScope.auth.id;

        $http.post(url, resource)
          .success(function(response) {

            _.each(response, function(d) {
              data[d.type + 's'].push(d);
            });

            prepareResources();
            resolve(response);
            $mdToast.show($mdToast.simple()
              .content('Resource erfolgreich erstellt')
              .position('bottom right')
              .hideDelay(3000));
          })
          .error(function(error) {
            $mdToast.show($mdToast.simple()
              .content(error[0].content.detail)
              .position('bottom right')
              .hideDelay(5000));
            resolve(error);
          });
      });
    }

    function updateResource(resource) {
      var url = [RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve) {

        delete resource.type;
        resource.author_id = $rootScope.auth.id;

        $http.patch(url, resource)
          .success(function(response) {

            data[response[0].type + 's'].splice(_.findIndex(data[response[0].type + 's'], {
              id: response[0].id
            }), 1, response[0]);

            console.log('update succeeded');

            prepareResources();
            resolve(response);
            $mdToast.show($mdToast.simple()
              .content('Resource erfolgreich aktualisiert')
              .position('bottom right')
              .hideDelay(3000));
          })
          .error(function(error) {
            $mdToast.show($mdToast.simple()
              .content(error[0].content.detail)
              .position('bottom right')
              .hideDelay(5000));
            resolve(error);
          });
      });
    }

    function destroyResource(resource) {
      var url = [RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve) {
        $http.delete(url)
          .success(function(response) {

            data[response[0].type + 's'].splice(_.findIndex(data[response[0].type + 's'], {
              id: response[0].id
            }), 1);

            prepareResources();
            resolve(response);
            $mdToast.show($mdToast.simple()
              .content('Resource erfolgreich gelöscht')
              .position('bottom right')
              .hideDelay(3000));
          })
          .error(function(error) {
            $mdToast.show($mdToast.simple()
              .content(error[0].content.detail)
              .position('bottom right')
              .hideDelay(5000));
            resolve(error);
          });
      });
    }

  }
}());

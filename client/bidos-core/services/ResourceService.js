/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('ResourceService', ResourceService);

  function ResourceService($rootScope, $http, $q) {

    /* Basic CRUD operations w/ HTTP calls to the back end. */

    /* TODO: The back end should authenticate the user, check for it's group
    /* and respond with the correct resource object the user is allowed to
    /* get. */

    var flatResources = {};
    var nestedResources = {};
    var RESOURCE_PATH = 'v1';
    var DEFAULT_RESOURCE = 'resources/vanilla';

    return {
      get: getResources,
      create: createResource,
      update: updateResource,
      destroy: destroyResource,
    };

    function nestResources() {
      var nestedResources = {};

      nestedResources.institutions = flatResources.institutions;
      nestedResources.users = flatResources.users;
      nestedResources.domains = flatResources.domains;

      // domains -> subdomains
      _.each(nestedResources.domains, function(domain) {
        domain.subdomains = _.select(flatResources.subdomains, {
          domain_id: domain.id
        });


        // subdomains -> items
        _.each(domain.subdomains, function(subdomain) {
          subdomain.items = _.select(flatResources.items, {
            subdomain_id: subdomain.id
          });

          // items -> behaviours
          _.each(subdomain.items, function(item) {
            item.behaviours = _.select(flatResources.behaviours, {
              item_id: item.id
            });

            item.subdomain = _.select(domain.subdomains, {
              id: item.subdomain_id
            })[0];

            item.domain = _.select(nestedResources.domains, {
              id: item.subdomain.domain_id
            })[0];

            item.examples = _.chain(item.behaviours)
              .map('examples')
              .flatten()
              .value();

            item.ideas = _.chain(item.behaviours)
              .map('ideas')
              .flatten()
              .value();

            item.observations = _.chain(item.behaviours)
              .map('observations')
              .flatten()
              .value();



            // behaviours -> observations
            // behaviours -> examples
            // behaviours -> ideas
            _.each(item.behaviours, function(behaviour) {
              behaviour.observations = _.select(flatResources.observations, {
                behaviour_id: behaviour.id
              });

              behaviour.examples = _.select(flatResources.examples, {
                behaviour_id: behaviour.id
              });

              behaviour.ideas = _.select(flatResources.ideas, {
                behaviour_id: behaviour.id
              });
            });

            // extra stuff
            item.subdomain = _.select(domain.subdomains, {
              id: item.subdomain_id
            })[0];

            item.domain = _.select(nestedResources.domains, {
              id: item.subdomain.domain_id
            })[0];

            item.examples = _.chain(item.behaviours)
              .map('examples')
              .flatten()
              .value();

            item.ideas = _.chain(item.behaviours)
              .map('ideas')
              .flatten()
              .value();

            item.observations = _.chain(item.behaviours)
              .map('observations')
              .flatten()
              .value();
          });
        });
      });

      nestedResources.groups = flatResources.groups;

      // groups -> users
      // groups -> kids
      _.each(nestedResources.groups, function(group) {
        group.users = _.select(flatResources.users, {
          group_id: group.id
        });
        group.kids = _.select(flatResources.kids, {
          group_id: group.id
        });
      });

      nestedResources.subdomains = _.chain(nestedResources.domains)
        .map('subdomains')
        .flatten()
        .value();

      nestedResources.items = _.chain(nestedResources.subdomains)
        .map('items')
        .flatten()
        .value();

      nestedResources.behaviours = _.chain(nestedResources.items)
        .map('behaviours')
        .flatten()
        .value();

      nestedResources.kids = _.chain(flatResources.groups)
        .map('kids')
        .flatten()
        .value();

      nestedResources.observations = _.chain(nestedResources.behaviours)
        .map('observations')
        .flatten()
        .value();

      _.each(nestedResources.observations, function(observation) {
        var byId = {
          observation_id: observation.id
        };

        observation.kid = _.select(flatResources.kids, byId);

        observation.behaviour = _.select(flatResources.behaviours, {
          id: observation.behaviour_id
        })[0];

        observation.kid = _.select(flatResources.kids, {
          id: observation.kid_id
        })[0];

        observation.user = _.select(flatResources.users, {
          id: observation.user_id
        })[0];

        observation.author = _.select(flatResources.users, {
          id: observation.author_id
        })[0];

        observation.item = _.select(flatResources.items, {
          id: observation.behaviour.item_id
        })[0];

        observation.subdomain = _.select(flatResources.subdomains, {
          id: observation.item.subdomain_id
        })[0];

        observation.domain = _.select(flatResources.domains, {
          id: observation.subdomain.domain_id
        })[0];

      });


      _.each(nestedResources.kids, function(kid) {
        kid.bday = new Date(kid.bday);
      });

      console.log(nestedResources);
      return nestedResources;
    }


    function getResources(sync) {
      var url = [RESOURCE_PATH, DEFAULT_RESOURCE].join('/');
      return $q(function(resolve) {
        if (_.isEmpty(flatResources) || sync) {
          $http.get(url)
            .success(function(response) {
              flatResources = response;
              nestedResources = nestResources(flatResources);
              resolve(nestedResources);
            });
        } else {
          resolve(nestedResources);
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

            _.each(response, function(d, i) {
              flatResources[i].push(d[0]);
            });

            nestedResources = nestResources(flatResources);
            resolve(nestedResources);
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

            _.each(response, function(d, i) {
              flatResources[i].splice(_.findIndex(flatResources[i], {
                id: d[0].id
              }), 1, d[0]);
            });

            nestedResources = nestResources(flatResources);
            resolve(nestedResources);
          });
      });
    }

    function destroyResource(resource) {
      var url = [RESOURCE_PATH, resource.type, resource.id].join('/');
      return $q(function(resolve) {
        $http.delete(url)
          .success(function(response) {

            var resource = flatResources[response[0]];
            resource.splice(_.findIndex(resource, response[1]), 1);

            nestedResources = nestResources(flatResources);
            resolve(nestedResources);
          });
      });
    }

  }
}());

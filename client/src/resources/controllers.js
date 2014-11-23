/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('./constants');
  require('./services');

  angular.module('bidos.resource.controllers', [
    'bidos.resource.constants',
    'bidos.resource.services'
  ]).controller('resourceCtrl', resourceCtrl);

  function resourceCtrl($scope, $rootScope, resourceService, $state, $stateParams, $document, ALLOWED_RESOURCES) {
    console.info('[resourceCtrl] $rootScope.auth', $rootScope.auth);

    var vm = this; // available as rx in all views (rx is for resources!)

    console.log($stateParams);
    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.params = toParams;
      if (toParams.domainId) {
        vm.currentDomain = vm.domains[toParams.domainId];
      }
    });

    vm.createGroup = function(group) {
      debugger
    };

    // id: number, optional (get * w/o)
    // allowedResources: array, see ./constants
    vm.getResources = function(allowedResources) {
      resourceService.get(allowedResources).then(function getResourcesSuccess(response) {
        var domains =

          // domains -> subdomains
          _(response.domain).each(function(domain) {
            domain.subdomains = _.filter(response.subdomain, function(subdomain) {
              return subdomain.domain_id == domain.id;
            });

            // subdomains -> items
            _(domain.subdomains).each(function(subdomain) {
              subdomain.items = _.filter(response.item, function(item) {
                return item.subdomain_id == subdomain.id;
              });

              // items -> behaviours
              _(subdomain.items).each(function(item) {
                item.behaviours = _.filter(response.behaviour, function(behaviour) {
                  return behaviour.item_id == item.id;
                });

                // behaviours -> examples
                _(item.behaviours).each(function(behaviour) {
                  behaviour.examples = _.filter(response.example, function(example) {
                    return example.behaviour_id == behaviour.id;
                  });

                });
              });
            });
          }).value();

        /* TODO! write proper sql statements that return properly nested and
        /* ready to go data */

        vm.users = response.user; // <-- singular FIXME?
        vm.kids = response.kid;
        vm.groups = response.group;

        console.log(vm.users);

        vm.domains = domains;
        // _.merge(vm, newResources);
        console.info('Resources:', vm);
      }, function getResourcesError(response) {
        console.warn('Error:', response.data);
      });
    };

    // init: get everything we are allowed to get
    if ($rootScope.auth) {
      vm.getResources(ALLOWED_RESOURCES[$rootScope.auth.role]);
      $state.go('auth.items', {'domainId': 0}); // FIXME

    } else {
      $state.go('public.login');
    }
  }
}());

/* jshint: case: false */
/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('./services');

  angular.module('bidos.resource.controllers', [
    'bidos.resource.services'
  ]).controller('resourceCtrl', resourceCtrl);

  function resourceCtrl($scope, $rootScope, resourceService, $state, $stateParams, $document, ALLOWED_RESOURCES) {
    console.info('[resourceCtrl] $rootScope.auth', $rootScope.auth);

    var vm = this; // available as rx in all views (rx is for resources!)

    vm.state = {
      updatedAt: null,
      selection: {
        kid: null,
        domain: null,
        item: null,
        subdomain: null
      }
    };

    console.log($stateParams);
    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.params = toParams;
      // if (toParams.domainId) {
        // vm.currentDomain = vm.domains[toParams.domainId];
      // }
    });

    vm.selectKid = function(kid) {
      vm.state.selection.kid = kid;
      console.log('selected kid:', kid.id, kid.name);
      console.log($state.params);
    };

    vm.selectDomain = function(domain) {
      // vm.state.selection.domain = domain;
      console.log('selected domain:', domain.id, domain.title);
      console.log($state.params);
    };

    vm.selectSubdomain = function(subdomain) {
      // vm.state.selection.subdomain = subdomain;
      console.log('selected subdomain:', subdomain.id, subdomain.title);
      console.log($state.params);
    };

    vm.selectItem = function(item) {
      vm.state.selection.item = item;
      console.log('selected item:', item.id, item.title);
      console.log($state.params);
    };

    vm.getResources = function(allowedResources) {
      resourceService.get(allowedResources).then(function getResourcesSuccess(response) {
        vm.data = response;
        console.info('Resources:', vm);
      }, function getResourcesError(response) {
        console.warn('Error:', response.data);
      });
    };

    // init: get everything we are allowed to get
    if ($rootScope.auth) {
      vm.getResources(ALLOWED_RESOURCES[$rootScope.auth.role]);
      $state.go('auth.domain', {domain: 0}); // FIXME

    } else {
      $state.go('public.login');
    }
  }
}());

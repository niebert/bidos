/* jshint: case: false */
/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('./services');

  angular.module('bidos.resource.controllers', [
    'bidos.resource.services'
    ]).controller('ResourceController', ResourceController);

  function ResourceController($scope, $rootScope, resourceService, $state, $stateParams, $location) {
    console.info('[ResourceController] $rootScope.auth', $rootScope.auth);

    var vm = this; // view model, available as vm in all views

    vm.data = {};
    vm.selection = {};
    vm.sel = {};

    // if (!vm.selection.kid) {
    //   console.warn('no kid selected, go to kid');
    //   $state.go('auth.kid.select');
    // } else if (!vm.selection.domain) {
    //   console.warn('no domain selected, go to domain list');
    // } else if (!vm.selection.subdomain) {
    //   console.warn('no subdomain selected, go to subdomain list');
    // }

    console.info('[ResourceController] $stateParams', $stateParams);

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.params = toParams;
      if (toParams.itemId) {}
    });

    // if (!vm.data.items && vm.data.domains) {
    // }


    vm.selectItem = function(item) {
      if (!item) { return; }
      vm.sel.item = _.chain(vm.data.items).filter().select(item).first().value();
      console.info(vm.sel.item);
    };

    vm.selectKid = function(kidId) {
      if (!kidId) { return; }
      vm.sel.kid = _.chain(vm.data.groups).map('kids').flatten().select({id:kidId}).first().value();
    };

    vm.getData = function(role) {
      // everybody needs resources
      resourceService.getResources().then(function (response) {
        _.merge(vm.data, response);

        // separate items object
        vm.data.items = _.chain(vm.data.domains).map('subdomains').flatten().map('items').flatten().value();

        console.info('[ResourceController] Resource Data (vm):', vm);
      }, function failure(response) {
        console.warn('[ResourceController] Resource Data Error:', response.data);
      });

      // only admin needs users
      // XXX backend should respond w/ 5xx if we're not admin
      if (role === 'admin') {
        resourceService.get('user').then(function (response) {
        _.merge(vm.data, response.data);
          console.info('[ResourceController] Admin Data (vm):', vm);
        }, function failure(response) {
          console.warn('[ResourceController] Admin Data Error:', response.data);
        });
      }
    };

    if ($rootScope.auth) {
      vm.getData($rootScope.auth.role);
      // $state.go('auth.home'); // FIXME
    } else {
      vm = void 0; // delete view model
      $state.go('public.login');
    }
  }
}());

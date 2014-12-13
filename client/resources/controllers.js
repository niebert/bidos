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
    console.info('[$rootScope.auth]', $rootScope.auth);

    // view model, available as vm in all views
    var vm = _.merge(this, {data:{}, selected:{}});

    // vm.data = {}; // data model copy via service
    // vm.sel = {}; // selection: { kid: {/*...*/}, item: {/*...*/} }

    // if (!vm.selection.kid) {
    //   console.warn('no kid selected, go to kid');
    //   $state.go('auth.kid.select');
    // } else if (!vm.selection.domain) {
    //   console.warn('no domain selected, go to domain list');
    // } else if (!vm.selection.subdomain) {
    //   console.warn('no subdomain selected, go to subdomain list');
    // }

    console.info('[vm] $stateParams', $stateParams);

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.params = toParams;
      if (toParams.kidId) {
        vm.selected.kid = _.select(vm.data.kids, ({id:+toParams.kidId}));
      }
    });

    vm.selectKid = function(kid) {
      if (!kid) {
        delete(vm.selected.kid);
        return;
      }

      if (typeof kid === 'number') {
        kid = _.chain(vm.data.resources.groups).map('kids').flatten().select({id:kid}).first().value();
      }

      // get selected kid from nested resource tree
      vm.selected.kid = kid;
      console.log(vm.selected.kid);
    };

    vm.selectItem = function(item) {
      if (!item) {
        delete(vm.selected.observation);
        delete(vm.selected.item);
        delete(vm.selected.subdomain);
        delete(vm.selected.domain);
        return;
      }

      if (typeof item === 'number') {
        item = _.chain(vm.data.resources.domains).map('subdomains').flatten().map('items').flatten().select({id:item}).first().value();
      }

      vm.selected.item = item;
      vm.selected.subdomain = _.select(vm.data.subdomains, {id: item.subdomain_id})[0];
      vm.selected.domain = _.select(vm.data.domains, {id: vm.selected.subdomain.domain_id})[0];
    };

    // author_id, item_id, value, help
    vm.makeObservation = function(observation) {
      if (observation.value <= 0) {
        delete(vm.selected.behaviour);
      }

      console.info(observation);
      resourceService.create('observation', {
        item_id: observation.itemId,
        author_id: $rootScope.auth.id,
        value: observation.value,
        help: observation.help || null
      });
    };

    vm.selectBehaviour = function(behaviour) {
      if (!behaviour) {
        delete(vm.selected.behaviour);
        return;
      }

      vm.selected.behaviour = behaviour;
      console.log(behaviour);
    };

    vm.addExample = function(behaviour) {
      behaviour.push({
        behaviour_id: behaviour.id
      });
    };

    vm.removeExample = function(example) {
      vm.data.examples.behaviour.push({
        behaviour_id: behaviour.id
      });
    };

    vm.getData = function(role) {
      var resources = ['resources', 'kid', 'group', 'domain', 'subdomain', 'item', 'example', 'behaviour'];

      // only admin needs users
      // XXX backend should respond w/ 5xx if we're not admin
      if (role === 'admin') {
        resources.concat(['user']);
      }

      resourceService.get(resources).then(function (response) {
        _.merge(vm.data, response); // response == data model
        console.info('[vm]', vm);
      }, function failure(response) {
        console.error('[vm]', response.data);
      });

    };

    if ($rootScope.auth) {
      vm.getData($rootScope.auth.role);
    } else {
      vm = void 0; // delete view model
      $state.go('public.login');
    }
  }
}());

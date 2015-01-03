/* jshint: camelcase: true */
/* global angular, faker */

(function() {
  'use strict';

  var _ = require('lodash');

  faker.locale = 'de';

  angular.module('bidos')
  .controller('ResourceController', ResourceController);

  function ResourceController($scope, $rootScope, resourceService, $state, $stateParams, $q, $window) {

    // view model, available as vm in all views
    var vm = _.merge(this, {
      data: {},
      selected: {},
      new: {},
      edit: {},

      // generic resource classes
      newObservation: newObservation,
      newItem: newItem,
      saveItem: saveItem,
      getDomainTitle: getDomainTitle,
      getGroupName: getGroupName,
      logout: logout,

      checkRole: checkRole,
      roleCSS: roleCSS,
    });


    console.log('%cSTATE', 'color: #fd801e; font-size: 1.2em', $state);

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      if (!vm) {
        return;
      }

      vm.params = toParams;
      if (toParams.kidId) {
        selectResource('kid', ({id:+toParams.kidId}));
      }

      if (toParams.itemId) {
        // TODO
      }
    });

    // function syncResources() {
    //   if (_.isEmpty(vm.data)) {
    //     console.log('no resources synced. syncing now.');
    //     resourceService.get().then(function(data) {
    //       angular.extend(vm.data, data);
    //     });
    //   } else {
    //     console.log('there are resources but i have no idea how old they are.', vm);
    //   }
    // }

    // syncResources();

    function roleCSS() {
      switch ($rootScope.auth.role) {
        case 'practitioner': return "practitioner-colors";
        case 'scientist': return "scientist-colors";
      }
    }


    function checkRole(what) {
      var permissions = {
        practitioner: ['itemsTable', 'observationsTable', 'kidsTable'],
        scientist:    ['itemsTable', 'observationsTable', 'kidsTable', 'stats'],
      };

      if ($rootScope.auth) {
        if ($rootScope.auth.role === 'admin') {
          return true; // XXX FIXME HACK
        } else {
          console.log(what, _.contains(permissions[$rootScope.auth.role]));
          return _.contains(permissions[$rootScope.auth.role], what);
        }
      }
    }


    function logout() {
      // $window.localStorage.getItem('auth_token');
      $window.localStorage.clear();
      $state.go('public.login');
    }


    function getDomainTitle(subdomain_id) {
      return _.select(vm.data.domains, {id:subdomain_id})[0].title;
    }

    function getGroupName(kid_id) {
      return _.select(vm.data.groups, {id:kid_id})[0].name;
    }



    var ITEM_BEHAVIOUR_COUNT = 3;


    // FIXME WTF


    function newObservation() {
      if (vm.new.observation) {
        console.warn('%cATTENTION ATTENTION! OVERWRITING OLD ITEM!', 'color: #e53c14; font-size: 1.6em');
      }
      vm.new.observation = new Observation();
    }


    function newItem() {
      if (vm.new.item) {
        console.warn('%cATTENTION ATTENTION! OVERWRITING OLD ITEM!', 'color: #e53c14; font-size: 1.6em');
      }
      vm.new.item = new Item();
    }


    function saveItem() {
      if (!vm.edit.item || !vm.new.item) {
        return;
      }

      console.log('saving item');

      vm.edit.item.save();
      vm.new.item.save();
    }


    function assembleItem(item) {
      item = new Item(item); // omg sorry!!1 FIXME

      item.subdomain = _.select(vm.data.subdomains, {id:item.subdomain_id})[0];
      item.domain = _.select(vm.data.domains, {id:item.subdomain.id})[0];

      item.behaviours = _.chain(vm.data.behaviours).select({item_id:item.id}).map(function(behaviour) {
        return new Behaviour(behaviour.niveau, behaviour);
      }).value();

      _.each(item.behaviours, function(behaviour) {

        item.examples = _.chain(vm.data.examples).select({behaviour_id:behaviour.id}).map(function(example) {
          behaviour.addExample(new Example(example));
        }).value();

        item.observations = _.chain(vm.data.observations).select({behaviour_id:behaviour.id}).map(function(obervation) {
          return new Observation(obervation);
        }).value();

      });

      return item;
    }


    function assembleKid(kid) {
      kid.group = _.select(vm.data.groups, {id:kid.group_id})[0];

      // select observations -> behaviours -> items
      // kid.items = _.chain(vm.data.observations).select({kid_id:kid.id});


      return kid;
    }


  }
}());

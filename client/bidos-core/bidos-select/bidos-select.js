(function() {
  'use strict';
  /* global angular, faker, _ */

  angular.module('bidos')
    .directive('bidosSelect', bidosSelect);

  faker.locale = 'de';

  function bidosSelect() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: function(elem, attrs) {
        return 'bidos-core/bidos-select/_templates/bidos-select-' + attrs.resource + '.html';
      }
    };

    function controller(ResourceService, $mdDialog, $rootScope, $state, $stateParams, CaptureService, STRINGS) {
      var vm = angular.extend(this, {
        select: select,
        nextExample: nextExample
      });

      function nextExample(behaviour) {
      }

      function select(resource) {
        CaptureService.select(resource);
      }

      function updateViewModel(data) {
        angular.extend(vm, data);
        angular.extend(vm, STRINGS);
      }

      CaptureService.get()
        .then(function(observation) {
          vm.observation = observation;

          switch ($stateParams.resource) {
            case 'domain':
              delete vm.observation.domain;
              delete vm.observation.subdomain;
              delete vm.observation.item;
              if (!observation.kid) {
                $state.go('auth.capture');
              }
              break;
            case 'subdomain':
              delete vm.observation.subdomain;
              delete vm.observation.item;
              if (!observation.domain) {
                $state.go('auth.capture');
              }
              break;
            case 'item':
              delete vm.observation.item;
              if (!observation.subdomain) {
                $state.go('auth.capture');
              }
              break;
            case 'behaviour':
              delete vm.observation.behaviour;
              if (!observation.item) {
                $state.go('auth.capture');
              }
              break;
          }

          ResourceService.get()
            .then(function(data) {
              updateViewModel(data);
            });

        });
    }
  }

}());

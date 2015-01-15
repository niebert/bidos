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
        switch (resource.type) {
          case 'kids':
            $state.go('auth.capture');
            break;
          case 'domains':
            $state.go('auth.select', {
              resource: 'subdomains'
            });
            break;
          case 'subdomains':
            $state.go('auth.select', {
              resource: 'items'
            });
            break;
          case 'items':
            $state.go('auth.capture');
            break;
          case 'behaviours':
            $state.go('auth.select', {
              resource: 'helps'
            });
            break;
          case 'helps':
            $state.go('auth.finish-observation');
            break;
        }
      }

      function updateViewModel(data) {
        angular.extend(vm, data);
        angular.extend(vm, STRINGS);

        if (vm.observation.domain) {
          vm.subdomains = _.filter(data.subdomains, {
            domain_id: vm.observation.domain.id
          });
        }

        if (vm.observation.subdomain) {
          vm.items = _.filter(data.items, {
            subdomain_id: vm.observation.subdomain.id
          });
        }

        if (vm.observation.item) {
          vm.behaviours = _.filter(data.behaviours, {
            item_id: vm.observation.item.id
          });
        }

        console.log(vm);
      }

      CaptureService.get()
        .then(function(observation) {
          vm.observation = observation;

          switch ($stateParams.resource) {
            case 'domains':
              delete vm.observation.domain;
              delete vm.observation.subdomain;
              delete vm.observation.item;
              if (!observation.kid) {
                $state.go('auth.capture');
              }
              break;
            case 'subdomains':
              delete vm.observation.subdomain;
              delete vm.observation.item;
              if (!observation.domain) {
                $state.go('auth.capture');
              }
              break;
            case 'items':
              delete vm.observation.item;
              if (!observation.subdomain) {
                $state.go('auth.capture');
              }
              break;
            case 'behaviours':
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

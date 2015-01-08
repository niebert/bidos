(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosSelectDomain', bidosSelectDomain)
    .directive('bidosSelectItem', bidosSelectItem);

  function bidosSelectDomain() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-selectItem/bidos-selectDomain.html'
    };

    function controllerFn(ResourceService, $state, CaptureService) {
      var vm = angular.extend(this, {
        selectDomain: selectDomain,
      });

      ResourceService.get()
        .then(function(data) {
          vm.data = data;
        });

      function selectDomain(domain) {
        console.log(domain);
        CaptureService.selectDomain(domain);
        $state.go('auth.selectItem');
      }
    }
  }

  function bidosSelectItem() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-selectItem/bidos-selectItem.html'
    };

    function controllerFn(ResourceService, $state, CaptureService) {
      var vm = angular.extend(this, {
        selectItem: selectItem,
      });

      ResourceService.get()
        .then(function(data) {
          vm.data = data;
        });

      CaptureService.getCurrent()
        .then(function(observation) {
          vm.observation = observation;

          // fallback to select-domain if no domain is selected
          if (!observation.domain) {
            $state.go('auth.selectDomain');
          }
        });

      function selectItem(item) {
        console.log(item);
        CaptureService.selectItem(item);
        $state.go('auth.capture');
        console.log(vm.observation);
      }

    }
  }

}());

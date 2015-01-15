(function() {
  'use strict';
  /* global angular, Please */

  angular.module('bidos')
    .directive('bidosCapture', bidosCapture);

  function bidosCapture() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-capture/bidos-capture.html'
    };

    function controllerFn($state, CaptureService) {

      var vm = angular.extend(this, {
        selectDomain: selectDomain,
        selectBehaviour: selectBehaviour
      });

      CaptureService.getCurrent()
        .then(function(observation) {
          angular.extend(vm, observation);
        });

      function selectDomain() {
        if (!vm.kid) {
          return;
        }

        CaptureService.selectDomain();
        $state.go('auth.select-domain');
      }


      function selectBehaviour() {
        if (!vm.kid) {
          return;
        }

        CaptureService.selectBehaviour();
        $state.go('auth.select-behaviour');
      }


    }
  }

}());

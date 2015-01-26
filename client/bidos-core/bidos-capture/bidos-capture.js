(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosCapture', bidosCapture);

  function bidosCapture() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-capture/bidos-capture.html'
    };

    function controllerFn($state, CaptureService) {

      var vm = angular.extend(this, {
        selectKid: selectKid,
        selectDomain: selectDomain,
        selectBehaviour: selectBehaviour
      });

      CaptureService.get()
        .then(function(observation) {
          angular.extend(vm, observation);
        });

      function selectKid() {
        $state.go('auth.select', {
          type: 'kid'
        });
      }

      function selectDomain() {
        if (!vm.kid) {
          return;
        }

        $state.go('auth.select', {
          type: 'domain'
        });
      }

      function selectBehaviour() {
        if (!vm.kid) {
          return;
        }

        $state.go('auth.select', {
          type: 'behaviour'
        });
      }
    }
  }

}());

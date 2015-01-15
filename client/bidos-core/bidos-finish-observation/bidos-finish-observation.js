(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosFinishObservation', bidosFinishObservation);

  function bidosFinishObservation() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-finish-observation/bidos-finish-observation.html'
    };

    function controller($state, $mdDialog, ResourceService, CaptureService) {
      var vm = angular.extend(this, {
        dialog: dialog,
        complete: complete
      });

      CaptureService.get()
        .then(function(observation) {
          if (_.isEmpty(observation) || observation.allDone) {
            $state.go('auth.capture');
          }
          vm.observation = observation;
        });

      function complete() {
        CaptureService.complete();
      }

      function dialog(ev, type) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              type: type,
              parent: vm
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-finish-observation/bidos-finish-observation.dialog.html'
          })
          .then(function(response) {
            console.log('dialog succeeded', response);
          }, function(response) {
            console.log('dialog cancelled', response);
          });
      }

      function dialogController($mdDialog, type, parent) {
        angular.extend(this, {
          type: type,
          parent: parent,
          cancel: cancel,
          save: save
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function save(resource) {
          CaptureService.select(resource);
          $mdDialog.hide();
        }
      }

    }
  }

}());

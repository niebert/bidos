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
      templateUrl: '/bidos-core/bidos-finish-observation/bidos-finish-observation.html'
    };

    function controller($state, $mdDialog, ResourceService, CaptureService) {
      var vm = angular.extend(this, {
        dialog: dialog,
        save: save
      });

      CaptureService.getCurrent()
        .then(function(observation) {

          if (!observation.domain || !observation.subdomain || !observation.item) {
            $state.go('auth.select-domain');
            return;
          }

          angular.extend(vm, observation);
        });


      function save() {
        CaptureService.saveObservation();
      }

      function dialog(ev, type) {

        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              type: type
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-finish-observation/bidos-finish-observation.dialog.html'
          })
          .then(function(response) {
            console.log('dialog succeeded', response);
          }, function(response) {
            console.log('dialog cancelled', response);
          });
      }

      function dialogController($mdDialog, type) {
        debugger
        angular.extend(this, {
          type: type,
          cancel: cancel,
          save: save,
          add: add
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function save() {
          $mdDialog.hide();
        }

        function add(resource, content) {
          CaptureService.add(resource, content);
          $mdDialog.hide();
        }
      }

    }
  }

}());

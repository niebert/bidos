(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bxObservationInbox', bxObservationInbox);

  function bxObservationInbox() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-observation-inbox.html'
    };

    function controllerFn($rootScope, $mdDialog, $mdToast, Resources) {
      var vm = angular.extend(this, {
        dialog: dialog
      });

      debugger

      Resources.get()
        .then(function(data) {

          vm.obs = data.observations;

          vm.tabs = [{
            title: 'Neue Beobachtungen',
          }, {
            title: 'Eigene Beobachtungen'
          }];

        });

      function dialog(ev, obs) {
        $mdDialog.show({
            templateUrl: 'templates/bx-observation-approve-dialog.html',
            targetEvent: ev,
            bindToController: false,
            controllerAs: 'vm',
            locals: {
              obs: vm.obs,
            },
            controller: dialogController
          })
          .then(function dialogSuccess(accepted) {
            if (accepted) {
              vm.observations.splice(_.findIndex(vm.observations, {
                id: obs.id
              }), 1);
            }
          }, function dialogAbort() {
            // ...
          });

        function dialogController($scope, $mdDialog, Resources, obs) {
          angular.extend(this, {
            cancel: cancel,
            accept: accept,
            reject: reject,
            obs: obs
          });

          console.log(obs);

          function cancel() {
            $mdDialog.cancel();
          }

          function accept() {
            $mdDialog.hide(true);
            obs.approved = true;
            Resources.update(obs);
            $mdToast.show(
              $mdToast.simple()
              .content('Beobachtung angenommen')
              .position('bottom right')
              .hideDelay(3000)
            );
          }

          function reject() {
            $mdDialog.hide(false);
            obs.approved = false;
            Resources.update(obs);
            $mdToast.show(
              $mdToast.simple()
              .content('Beobachtung abgelehnt')
              .position('bottom right')
              .hideDelay(3000)
            );
          }
        }


      }
    }
  }

}());

(function() {
  'use strict';
  /* global angular */

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

    function controllerFn($rootScope, $mdDialog, $mdToast, bxResources) {
      var vm = angular.extend(this, {
        icon: icon,
        dialog: dialog
      });

      vm.colors = require('../../config')
        .colors.obs;

      bxResources.get()
        .then(function(data) {

          // get only what we need
          vm.observations = _.filter(data.observations, function(obs) {
            return obs.behaviour && !obs.approved;
          });
        });

      function icon(category, name) {
        return '/lib/material-design-icons/' + category + '/svg/production/ic_' + name + '_48px.svg';
      }

      function dialog(ev, obs) {
        $mdDialog.show({
          templateUrl: 'templates/bx-observation-approve-dialog.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            obs: obs,
          },
          controller: function($scope, $mdDialog, bxResources, obs) {
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
              bxResources.update(obs);
              $mdToast.show(
                $mdToast.simple()
                .content('Beobachtung angenommen')
                .position('bottom right')
                .hideDelay(3000)
              );
            }

            function reject() {
              $mdDialog.hide(false);
              $mdToast.show(
                $mdToast.simple()
                .content('Beobachtung abgelehnt')
                .position('bottom right')
                .hideDelay(3000)
              );
            }
          }
        })
        .then(function dialogSuccess(accepted) {
          if (accepted) {
            vm.observations.splice(_.findIndex(vm.observations, { id: obs.id }), 1);
          }
        }, function dialogAbort() {
          // ...
        });
      }
    }
  }

}());

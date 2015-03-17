(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('ObservationInbox', ObservationInbox);

  function ObservationInbox() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-observation-inbox.html'
    };

    // debugger

    function controllerFn($rootScope, $mdDialog, $mdToast, Resources) {
      var vm = angular.extend(this, {
        icon: icon,
        dialog: dialog
      });

      vm.colors = require('../../../config')
        .colors.obs;

      Resources.get()
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
          controller: function($scope, $mdDialog, Resources, obs) {
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

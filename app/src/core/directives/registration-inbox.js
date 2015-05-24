(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bxRegistrationInbox', bxRegistrationInbox);

  function bxRegistrationInbox() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-registration-inbox.html'
    };

    function controllerFn($rootScope, $mdDialog, $mdToast, Resources) {
      var vm = angular.extend(this, {
        dialog: dialog
      });

      vm.colors = require('../../../config')
        .colors.user;

      Resources.get()
        .then(function(data) {

          // get only what we need
          vm.registrations = _.filter(data.users, function(user) {
            return !user.approved;
          });
        });

      function dialog(ev, user) {
        $mdDialog.show({
          templateUrl: 'templates/bx-registration-approve-dialog.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            user: user,
          },
          controller: function($scope, $mdDialog, Resources, user) {
            angular.extend(this, {
              cancel: cancel,
              accept: accept,
              reject: reject,
              user: user
            });

            console.log(user);

            function cancel() {
              $mdDialog.cancel();
            }

            function accept() {
              $mdDialog.hide(true);
              user.approved = true;
              Resources.update(user);
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
            vm.registrations.splice(_.findIndex(vm.registrations, { id: user.id }), 1);
          }
        }, function dialogAbort() {
          // ...
        });
      }
    }
  }

}());

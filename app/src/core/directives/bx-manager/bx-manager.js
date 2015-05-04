(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bxManager', bxManager);

  function bxManager() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-manager.html'
    };

    function controllerFn($rootScope, $mdDialog, $mdToast, Resources) {
      var vm = angular.extend(this, {
        dialog: dialog
      });

      Resources.get()
        .then(function(data) {

          vm.me = _.filter(data.users, {id: $rootScope.auth.id})[0];

          vm.data = data;

          vm.institutions = _.filter(data.institutions, function(institution) {
            return institution.id === vm.me.institution_id;
          });

          // _.each(vm.institutions, function(institution) {
          //   institution.groups = _.filter(data.groups, function(group) {
          //     return group.institution_id === institution.id;
          //   });

          //   _.each(institution.groups, function(group) {
          //     group.kids = _.filter(data.kids, function(kid) {
          //       return kid.group_id === group.id;
          //     });
          //   });
          // });

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

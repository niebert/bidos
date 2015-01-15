(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosProfile', bidosProfile);

  function bidosProfile() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-profile/bidos-profile.html'
    };

    function controllerFn($rootScope, $mdDialog) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        dialog: dialog
      });

      function dialog(ev) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              data: vm.data,
              user: vm.auth
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-profile/bidos-profile.dialog.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogController($mdDialog, ResourceService, data, user) {
        angular.extend(this, {
          cancel: cancel,
          update: update,
          data: data,
          user: user
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function update(user) {
          ResourceService.update('user', user)
            .then(function(response) {
              console.log('resource created:', user);
              $mdDialog.hide(response);
            });
        }
      }

    }
  }

}());

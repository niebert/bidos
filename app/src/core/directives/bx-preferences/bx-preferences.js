(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bxPreferences', bxPreferences);

  function bxPreferences() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-preferences.html'
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
            templateUrl: 'templates/bx-profile.dialog.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }

      function dialogController($mdDialog, Resources, data, user) {
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
          Resources.update('user', user)
            .then(function(response) {
              console.log('resource created:', user);
              $mdDialog.hide(response);
            });
        }
      }

    }
  }

}());

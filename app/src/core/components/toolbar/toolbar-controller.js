/* global angular */
angular.module('bidos')
  .controller('ToolbarController', ToolbarController);

  function ToolbarController($scope, $rootScope, $mdDialog) {
    $scope.me = $rootScope.me;

    $scope.SettingsDialog = function (ev, resource) {
      console.log('dialog resource', resource);

      $mdDialog.show({
        bindToController: false,
        controller: 'SettingsDialogController',
        controllerAs: 'vm',
        locals: {
          resource: resource
        },
        targetEvent: ev,
        templateUrl: `templates/settings-dialog.html`
      }).then(function(data) {
        console.log('dialog succeeded', data);
      }, function() {
        console.log('dialog cancelled');
      });
    };

  }

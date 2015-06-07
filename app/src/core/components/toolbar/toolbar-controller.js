/* global angular */
angular.module('bidos')
  .controller('ToolbarController', ToolbarController);

  function ToolbarController($scope, $rootScope, $mdDialog) {
    $scope.me = $rootScope.me;
    $scope.SettingsDialog = function (ev, resource) {
      $mdDialog.show({
        bindToController: false,
        controller: 'SettingsDialogController',
        controllerAs: 'vm',
        locals: {
          resource: resource
        },
        targetEvent: ev,
        templateUrl: `templates/settings-dialog.html`
      });
    };

  }

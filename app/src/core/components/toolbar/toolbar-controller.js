/* global _, angular */
angular.module('bidos')
  .controller('ToolbarController', ToolbarController);

  function ToolbarController(Resources, $scope, $rootScope, $mdDialog) {

    function getUser(resources) {
      if (!$rootScope.hasOwnProperty('auth')) {
        console.warn('$rootScope has no property auth!');
        return {};
      }
      return _.filter(resources.users, {
        id: $rootScope.auth.id
      })[0];
    }

    Resources.get().then(function(data) {
      $scope.me = getUser(data);
    });

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

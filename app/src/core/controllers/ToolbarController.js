/* global _, angular */
angular.module('bidos')
.controller('ToolbarController', ToolbarController);

function ToolbarController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS) {

  function updateViewModel() {
    Resources.get()
    .then(function(data) {

      $scope.resources = data;
      $scope.me = getUser(data);

      // actionButtons are all action buttons, myActionButtons are the one
      // the user actually should see
      $scope.myActionButtons = _.filter($scope.actionButtons, function(button) {
        return _.includes(button.roles, $scope.me.roleName);
      });

      function getUser(resources) {
        return _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];
      }

    });
  }

  updateViewModel();

  // $scope.config = CONFIG;
  // $scope.strings = STRINGS;
  // $scope.sortOrder = 'id';
  // $scope.stuff = {};
  // $scope.auth = $rootScope.auth;

  $scope.settingsDialog = function (ev) {
    $mdDialog.show({
      bindToController: false,
      controller: function() {
        console.info('SettingsDialogController');
        // debugger
        Resources.get().then(function(data) {
          $scope.me = data.me;
          console.info('me', $scope.me);
          // debugger
        });
      },
      controllerAs: 'vm',
      locals: {
        STRINGS: STRINGS
      },
      targetEvent: ev,
      templateUrl: 'templates/settings-dialog.html'
    }).then(function(data) {
      updateViewModel(data);
      console.log('dialog succeeded');
    }, function() {
      console.log('dialog cancelled');
    });
  };

}

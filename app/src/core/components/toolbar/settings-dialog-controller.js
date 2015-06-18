/* global angular */
angular.module('bidos')
  .controller('SettingsDialogController', SettingsDialogController);

function SettingsDialogController(Resources, $scope, $mdDialog, $rootScope, $mdToast, $state, UserFactory) {

  Resources.get().then(function(data) {
    $scope.me = data.me;
  });

  $scope.close = function() {
    $mdDialog.cancel();
  };

  $scope.logout = function() {
    console.log('[auth] logout attempt');
    UserFactory.logout();
    $state.go('public');
    $rootScope.auth = null;
    toast('Sie sind jetzt abgemeldet');
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }
}

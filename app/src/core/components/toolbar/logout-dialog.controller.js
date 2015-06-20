/* global angular */
angular.module('bidos')
  .controller('LogoutDialog', LogoutDialog);

function LogoutDialog(UserFactory, $scope, $mdDialog, $rootScope, $mdToast, $state) {

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

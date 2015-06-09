/* global _, angular */
angular.module('bidos')
  .controller('SettingsDialogController', SettingsDialogController);

function SettingsDialogController(Resources, $scope, $rootScope, $mdDialog, $mdToast, $state, UserFactory) {

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

  $scope.cancel = function() {
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

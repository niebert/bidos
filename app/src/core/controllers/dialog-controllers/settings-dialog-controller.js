/* global angular */
angular.module('bidos')
  .controller('SettingsDialogController', SettingsDialogController);

function SettingsDialogController(Resources, $scope) {

  console.info('SettingsDialogController');
    // debugger

  Resources.get().then(function(data) {
    $scope.me = data.me;
    console.info('me', $scope.me);
    // debugger
  });

}

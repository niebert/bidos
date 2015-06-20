/* global angular */
angular.module('bidos')
  .controller('SettingsDialog', SettingsDialog);

function SettingsDialog(Resources, $scope, $mdDialog) {

  $scope.close = function() {
    $mdDialog.cancel();
  };

}

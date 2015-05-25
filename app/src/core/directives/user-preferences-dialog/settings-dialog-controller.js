/* global angular */
angular.module('bidos')
  .controller('SettingsDialogController', SettingsDialogController);

function SettingsDialogController($scope, Resources, $mdDialog, STRINGS, CONFIG, $http) {

  $scope.approveUser = require('../../../lib/approveUser')($http, $mdDialog, CONFIG);

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

}

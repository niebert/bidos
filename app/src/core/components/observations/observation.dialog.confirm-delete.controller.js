/* global angular */
angular.module('bidos')
.controller('ConfirmDelete', ConfirmDelete);

function ConfirmDelete($scope, $mdDialog) {

  $scope.close = function () {
    $mdDialog.cancel();
  };

  $scope.confirm = function () {
    $mdDialog.hide();
  };

}

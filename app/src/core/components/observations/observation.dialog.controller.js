/* global angular */
angular.module('bidos')
.controller('ObservationDialogController', ObservationDialogController);

function ObservationDialogController($scope, $mdDialog, $state, locals) {
  $scope.observation = locals.observation;

  $scope.repeat = function () {
    $state.go('bidos.capture');
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };
}

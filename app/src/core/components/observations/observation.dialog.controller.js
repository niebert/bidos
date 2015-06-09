/* global angular */
angular.module('bidos')
.controller('ObservationDialogController', ObservationDialogController);

function ObservationDialogController(Resources, $scope, $rootScope, $mdDialog, $mdToast, $state, locals) {
  $scope.observation = locals.observation;

  $scope.me = $rootScope.me;

  $scope.repeat = function () {
    $state.go('bidos.capture');
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.accept = function (observation) {
  	observation.approved = true;
    Resources.update(observation).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Beobachtung akzeptiert');
    });
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

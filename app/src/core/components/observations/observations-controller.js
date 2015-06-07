/* global angular */
angular.module('bidos')
.controller('ObservationsController', ObservationsController);

function ObservationsController(Resources, $scope, $rootScope, $mdDialog) {

  $scope.viewObservation = function(ev, observation) {
    $mdDialog.show({
      targetEvent: ev,
      locals: {
        observation: observation
      },
      controller: 'ObservationDialogController',
      templateUrl: `templates/observation.dialog.view.html`
    }).then(function() {
      $scope.reset();
    }, function() {
    });
  };

  $scope.observations = $rootScope.data.observations.filter(function(observation) {
    if (!observation) return false;

    if (!observation.hasOwnProperty('author_id')) {
      observation.author_id = -1;
    }

    return (observation.author_id === $rootScope.me.id)
      && (observation.kid.group_id === $rootScope.me.group_id); // admin sees all observations
  });

}

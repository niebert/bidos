/* global angular */
angular.module('bidos')
.controller('ObservationsController', ObservationsController);

function ObservationsController(Resources, $scope, $rootScope) {

  Resources.get()
  .then(function(data) {
    $scope.observations = data.observations.filter(function(observation) {
      if (!observation) return false;

      return (observation.author_id === $rootScope.me.id)
      	&& (observation.kid.group_id === $rootScope.me.group_id); // admin sees all observations
    });
  });

}

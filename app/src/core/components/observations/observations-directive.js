'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosObservations', bidosObservations);

function bidosObservations() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'ObservationsController',
    templateUrl: '/templates/observations.html'
  };
}

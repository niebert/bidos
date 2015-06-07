'use strict';
/* global angular */
angular.module('bidos')
  .directive('bidosKids', bidosKids);

function bidosKids() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'KidsController',
    templateUrl: '/templates/kids.html'
  };
}

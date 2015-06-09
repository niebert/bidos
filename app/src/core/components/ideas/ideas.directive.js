'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosIdeas', bidosIdeas);

function bidosIdeas() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'IdeasController',
    templateUrl: '/templates/ideas.html'
  };
}

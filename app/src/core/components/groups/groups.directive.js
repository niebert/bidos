'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosGroups', bidosGroups);

function bidosGroups() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'GroupsController',
    templateUrl: '/templates/groups.html'
  };
}


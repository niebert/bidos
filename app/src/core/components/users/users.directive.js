'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosUsers', bidosUsers);

function bidosUsers() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'UsersController',
    templateUrl: '/templates/users.html'
  };
}


'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosItems', bidosItems);

function bidosItems() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'ItemsController',
    templateUrl: '/templates/items.html'
  };
}


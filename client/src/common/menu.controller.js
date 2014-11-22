/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../resources/resource-constants');
  require('../resources/resource-services');

  angular.module('bidos.menu.controller', [
    'bidos.resource.constants',
    'bidos.resource.services',
    'ngMaterial'
  ])

  .controller('menuCtrl', ['$scope', '$rootScope', 'resourceService', '$state', '$mdSidenav',
    function($scope, $rootScope, resourceService, $state, $mdSidenav) {

    $scope.openLeftMenu = function() {
      console.warn('$scope.openLeftMenu: $mdSidenav("left").toggle()');
      $mdSidenav('left').toggle();
    };

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

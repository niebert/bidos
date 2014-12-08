/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.routes', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // Main route for anything authenticated

      .state('auth', {
        url: '',
        templateUrl: 'layout.html'
      })

      ;

  }]);
}());

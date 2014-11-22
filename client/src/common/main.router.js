/* global angular */

(function() {
  'use strict';

  angular.module('bidos.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ROOT ROUTE

      .state('index', {
        url: '',
        templateUrl: 'partials/layout.html'
      })

      .state('admin', {
        url: 'admin',
        templateUrl: 'partials/dashboard.admin.html'
      })

      .state('practitioner', {
        url: 'practitioner',
        templateUrl: 'partials/dashboard.practitioner.html'
      })

      .state('scientist', {
        url: 'scientist',
        templateUrl: 'partials/dashboard.scientist.html'
      })

      ;

  }]);
}());

/* global angular */

(function() {
  'use strict';

  angular.module('bx.auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    /* Public route to authenticate. All other routes are private. */

    $stateProvider
      .state('public', {
        url: '',
        templateUrl: 'templates/bx-auth.html'
      })
      .state('reset', {
        url: '/reset/:hash',
        templateUrl: 'templates/bx-reset.html'
      });

  }]);
}());

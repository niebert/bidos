/* global angular */

(function() {
  'use strict';

  angular.module('auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // UNAUTHORIZED

      .state('unauthorized', {
        url: '',
        templateUrl: 'unauthorized/layout.html'
      })

      .state('unauthorized.login', {
        url: '/login',
        views: {
          main: { templateUrl: 'unauthorized/login.html' }
        }
      })

      .state('unauthorized.signup', {
        url: '/signup',
        views: {
          main: { templateUrl: 'unauthorized/signup.html' }
        }
      })

      // UNAUTHORIZED

      .state('authorized', {
        url: '',
        templateUrl: 'authorized/layout.html'
      })

      .state('authorized.admin', {
        url: '/admin',
        views: {
          menu: { templateUrl: 'authorized/admin/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('authorized.practitioner', {
        url: '/practitioner',
        views: {
          menu: { templateUrl: 'authorized/practitioner/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('authorized.scientist', {
        url: '/scientist',
        views: {
          menu: { templateUrl: 'authorized/scientist/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      ;

  }]);
}());

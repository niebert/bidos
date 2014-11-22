/* global angular */

(function() {
  'use strict';

  angular.module('auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // THE ALL EMBRACING AUTH ROUTE: all subsequent routes inherit it's
      // controller, as every connection to the back end must be authenticated

      // PUBLIC ROUTES

      .state('login', {
        url: '/login',
        views: {
          main: { templateUrl: 'auth/login.html' }
        }
      })

      .state('signup', {
        url: '/signup',
        views: {
          main: { templateUrl: 'auth/signup.html' }
        }
      })

      // AUTHORIZED

      // why tf is the controller sometimes recognized when it's set up here,
      // like below and sometimes when it's added directly to the element...
      // and sometimes vice versa.

      .state('auth', {
        url: '',
        templateUrl: 'partials/layout.html',
      })

      .state('auth.admin', {
        url: '/admin',
        views: {
          menu: { templateUrl: 'partials/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('auth.practitioner', {
        url: '/practitioner',
        views: {
          menu: { templateUrl: 'partials/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('auth.scientist', {
        url: '/scientist',
        views: {
          menu: { templateUrl: 'partials/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      ;

  }]);
}());

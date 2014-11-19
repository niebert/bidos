/* global angular */

(function() {
  'use strict';

  angular.module('auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // THE ALL EMBRACING AUTH ROUTE: all subsequent routes inherit it's
      // controller, as every connection to the back end must be authenticated

      // PUBLIC ROUTES

      .state('public', {
        url: '',
        templateUrl: 'layout.html'
      })

      .state('public.login', {
        url: '/login',
        views: {
          main: { templateUrl: 'public/login.html' }
        }
      })

      .state('public.signup', {
        url: '/signup',
        views: {
          main: { templateUrl: 'public/signup.html' }
        }
      })

      // AUTHORIZED

      // why tf is the controller sometimes recognized when it's set up here,
      // like below and sometimes when it's added directly to the element...
      // and sometimes vice versa.

      .state('auth', {
        url: '',
        templateUrl: 'layout.html',
        controller: 'resourceCtrl',
        controllerAs: 'vm'
      })

      .state('auth.admin', {
        url: '/admin',
        views: {
          menu: { templateUrl: 'auth/admin/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('auth.practitioner', {
        url: '/practitioner',
        views: {
          menu: { templateUrl: 'auth/practitioner/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('auth.scientist', {
        url: '/scientist',
        views: {
          menu: { templateUrl: 'auth/scientist/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      ;

  }]);
}());

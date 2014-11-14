/* global angular */

(function() {
  'use strict';

  angular.module('rw.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise(
      function($injector, $location) {
        $location.path('/');
      });

    $stateProvider

      .state('unauthorized', {
        url: '',
        views: {
          navbar: { templateUrl: 'unauthorized/navbar.html' },
        }
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

      .state('authorized', {
        url: '',
        abstract: true,
        template: '<div ui-view="navbar"></div><div ui-view="main"></div>'
      })

      .state('authorized.admin', {
        url: '/admin',
        views: {
          navbar: { templateUrl: 'authorized/admin/navbar.html' },
          main: { templateUrl: 'authorized/admin/dashboard.html' }
        }
      })

      ///////////
      // users //
      ///////////

      .state('authorized.admin.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'models/user/index.html' }
        }
      })

      .state('authorized.admin.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'models/user/new.html' }
        }
      })

      .state('authorized.admin.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'models/user/edit.html' }
        }
      })

      .state('authorized.admin.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'models/user/show.html' }
        }
      })

      ;

  }]);
}());

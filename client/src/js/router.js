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
          main: { templateUrl: 'unauthorized/landing.html' }
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
        templateUrl: 'authorized/layout.html'
      })

      ///////////
      // admin //
      ///////////

      .state('authorized.admin', {
        url: '/admin',
        views: {
          menu: { templateUrl: 'authorized/admin/menu.html' },
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      ///////////
      // users //
      ///////////

      .state('authorized.admin.users', {
        url: '/users',
        views: {
          main: { template: '<div ui-view="main"></div>' }
        }
      })

      .state('authorized.admin.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/admin/users/list.html' }
        }
      })

      .state('authorized.admin.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/admin/users/new.html' }
        }
      })

      .state('authorized.admin.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/admin/users/edit.html' }
        }
      })

      .state('authorized.admin.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/admin/users/show.html' }
        }
      })

      ;

  }]);
}());

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
          navbar: {
            templateUrl: 'navbar/unauthorized.html',
            controller: 'authCtrl',
            controllerAs: 'vm',
          },
        }
      })

      .state('unauthorized.login', {
        url: '/login',
        views: {
          main: { templateUrl: 'auth/login.html' }
        }
      })

      .state('unauthorized.signup', {
        url: '/signup',
        views: {
          main: { templateUrl: 'auth/signup.html' }
        }
      })

      .state('authorized', {
        abstract: true,
        url: '',
        views: {
          navbar: {
            template: '<div ui-view="navbar"/><div ui-view="main"/>',
            controller: 'authCtrl',
            controllerAs: 'vm',
          }
        }
      })

      .state('authorized.admin', {
        url: '/admin',
        views: {
          navbar: { templateUrl: 'navbar/authorized/admin.html' },
          main: { templateUrl: 'content/admin/dashboard.html' }
        }
      })

      ;

  }]);
}());

(function() {
  'use strict';

  angular.module('rw.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('index', {
        url: '/',
        templateUrl: '/'
      })

      .state('login', {
        url: '/login',
        templateUrl: '/login'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/signup'
      })

      .state('admin', {
        url: '/admin',
        templateUrl: '/admin'
      })

      .state('admin.users', {
        url: '/admin/users',
        templateUrl: '/admin/users',
      });

  }]);

}());

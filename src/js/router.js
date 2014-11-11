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
        views: {
          auth: {
            templateUrl: '/login',
            controller: 'authCtrl',
            controllerAs: 'vm'
          }
        }
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/signup'
      })

      .state('users', {
        url: '/users',
        templateUrl: '/users',
      });

  }]);

}());

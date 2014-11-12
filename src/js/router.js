(function() {
  'use strict';

  angular.module('rw.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('unauthorized', {
        views: {
          'navbar': {
            templateUrl: 'navbar.unauthorized',
            controller: 'authCtrl',
            controllerAs: 'vm'
          },
          'main': {
            templateUrl: 'login',
            controller: 'authCtrl',
            controllerAs: 'vm'
          }
        }
      })

      .state('unauthorized.login', {
        views: {
          'navbar': {
            templateUrl: 'navbar.unauthorized',
            controller: 'authCtrl',
            controllerAs: 'vm'
          },
          'main': {
            templateUrl: 'login',
            controller: 'authCtrl',
            controllerAs: 'vm'
          }
        }
      })

      .state('unauthorized.signup', {
        views: {
          'navbar': {
            templateUrl: 'navbar.unauthorized',
            controller: 'authCtrl',
            controllerAs: 'vm'
          },
          'main': {
            templateUrl: 'signup',
            controller: 'authCtrl',
            controllerAs: 'vm'
          }
        }
      })


      .state('login', {
        url: '/login',
        templateUrl: '/login',
        controller: 'authCtrl',
        controllerAs: 'vm'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/signup',
        controller: 'authCtrl',
        controllerAs: 'vm'
      })

      ;

  }]);
}());

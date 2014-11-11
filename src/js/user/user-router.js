(function() {
  'use strict';

  angular.module('rw.user.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('admin', {
        url: '/',
        templateUrl: '/'
      })

      .state('admin.users', {
        url: '/admin/users',
        templateUrl: '/admin/users'
      });

  }]);
}());

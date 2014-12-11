/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.routes', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // main route for anything authenticated
      .state('auth', {
        url: '',
        templateUrl: 'layout.html'
      })

      .state('auth.home', {
        url: '/home',
        views: {
          main: { templateUrl: 'home.html' }
        }
      })

      .state('auth.kid', {
        url: '/kid',
        views: {
          main: { templateUrl: 'resources/assets/kid.index.html' }
        }
      })

      .state('auth.user', {
        url: '/user',
        views: {
          main: { templateUrl: 'resources/assets/user.table.html' }
        }
      })

      .state('auth.item', {
        url: '/item',
        views: {
          main: { templateUrl: 'resources/assets/item.table.html' }
        }
      })

      .state('auth.item.show', {
        url: ':itemId',
        views: {
          main: { templateUrl: 'resources/assets/item.show.html' }
        }
      })

      .state('auth.item.do', {
        url: ':itemId/do',
        views: {
          main: { templateUrl: 'resources/assets/item.do.html' }
        }
      })

      .state('auth.group', {
        url: '/',
        views: {
          main: { templateUrl: 'resources/assets/group.table.html' }
        }
      })

      .state('auth.group.show', {
        url: ':groupId/details',
        views: {
          main: { templateUrl: 'resources/assets/group.show.html' }
        }
      })

      ;

  }]);
}());

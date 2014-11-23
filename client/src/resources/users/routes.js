/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.user.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })

      ;

  }]);
}());

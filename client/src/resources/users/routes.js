/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.user.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.admin.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.admin.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.admin.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.admin.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.practitioner.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.practitioner.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.practitioner.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.practitioner.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.scientist.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.scientist.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.scientist.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.scientist.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })

      ;

  }]);
}());

/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.users.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'auth/admin/users/index.html' }
        }
      })

      .state('auth.admin.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/admin/users/list.html' }
        }
      })

      .state('auth.admin.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/admin/users/new.html' }
        }
      })

      .state('auth.admin.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/admin/users/edit.html' }
        }
      })

      .state('auth.admin.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/admin/users/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'auth/practitioner/users/index.html' }
        }
      })

      .state('auth.practitioner.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/practitioner/users/list.html' }
        }
      })

      .state('auth.practitioner.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/practitioner/users/new.html' }
        }
      })

      .state('auth.practitioner.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/practitioner/users/edit.html' }
        }
      })

      .state('auth.practitioner.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/practitioner/users/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'auth/scientist/users/index.html' }
        }
      })

      .state('auth.scientist.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/scientist/users/list.html' }
        }
      })

      .state('auth.scientist.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/scientist/users/new.html' }
        }
      })

      .state('auth.scientist.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/scientist/users/edit.html' }
        }
      })

      .state('auth.scientist.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/scientist/users/show.html' }
        }
      })

      ;

  }]);
}());

/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.users.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('authorized.admin.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'authorized/admin/users/index.html' }
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



      // PRACTITIONER

      .state('authorized.practitioner.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'authorized/practitioner/users/index.html' }
        }
      })

      .state('authorized.practitioner.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/practitioner/users/list.html' }
        }
      })

      .state('authorized.practitioner.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/practitioner/users/new.html' }
        }
      })

      .state('authorized.practitioner.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/practitioner/users/edit.html' }
        }
      })

      .state('authorized.practitioner.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/practitioner/users/show.html' }
        }
      })



      // SCIENTIST

      .state('authorized.scientist.users', {
        url: '/users',
        views: {
          main: { templateUrl: 'authorized/scientist/users/index.html' }
        }
      })

      .state('authorized.scientist.users.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/scientist/users/list.html' }
        }
      })

      .state('authorized.scientist.users.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/scientist/users/new.html' }
        }
      })

      .state('authorized.scientist.users.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/scientist/users/edit.html' }
        }
      })

      .state('authorized.scientist.users.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/scientist/users/show.html' }
        }
      })

      ;

  }]);
}());

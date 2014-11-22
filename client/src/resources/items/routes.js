/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.item.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.admin.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.admin.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.admin.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.admin.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.practitioner.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.practitioner.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.practitioner.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.practitioner.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'resources/users/views/index.html' }
        }
      })

      .state('auth.scientist.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/users/views/list.html' }
        }
      })

      .state('auth.scientist.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/users/views/new.html' }
        }
      })

      .state('auth.scientist.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/users/views/edit.html' }
        }
      })

      .state('auth.scientist.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/users/views/show.html' }
        }
      })

      ;

  }]);
}());

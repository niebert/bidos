/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.items.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'auth/admin/items/index.html' }
        }
      })

      .state('auth.admin.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/admin/items/list.html' }
        }
      })

      .state('auth.admin.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/admin/items/new.html' }
        }
      })

      .state('auth.admin.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/admin/items/edit.html' }
        }
      })

      .state('auth.admin.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/admin/items/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'auth/practitioner/items/index.html' }
        }
      })

      .state('auth.practitioner.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/practitioner/items/list.html' }
        }
      })

      .state('auth.practitioner.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/practitioner/items/new.html' }
        }
      })

      .state('auth.practitioner.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/practitioner/items/edit.html' }
        }
      })

      .state('auth.practitioner.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/practitioner/items/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'auth/scientist/items/index.html' }
        }
      })

      .state('auth.scientist.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/scientist/items/list.html' }
        }
      })

      .state('auth.scientist.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/scientist/items/new.html' }
        }
      })

      .state('auth.scientist.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/scientist/items/edit.html' }
        }
      })

      .state('auth.scientist.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/scientist/items/show.html' }
        }
      })

      ;

  }]);
}());

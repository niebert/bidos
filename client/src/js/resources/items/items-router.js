/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.items.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('authorized.admin.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'authorized/admin/items/index.html' }
        }
      })

      .state('authorized.admin.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/admin/items/list.html' }
        }
      })

      .state('authorized.admin.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/admin/items/new.html' }
        }
      })

      .state('authorized.admin.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/admin/items/edit.html' }
        }
      })

      .state('authorized.admin.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/admin/items/show.html' }
        }
      })



      // PRACTITIONER

      .state('authorized.practitioner.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'authorized/practitioner/items/index.html' }
        }
      })

      .state('authorized.practitioner.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/practitioner/items/list.html' }
        }
      })

      .state('authorized.practitioner.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/practitioner/items/new.html' }
        }
      })

      .state('authorized.practitioner.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/practitioner/items/edit.html' }
        }
      })

      .state('authorized.practitioner.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/practitioner/items/show.html' }
        }
      })



      // SCIENTIST

      .state('authorized.scientist.items', {
        url: '/items',
        views: {
          main: { templateUrl: 'authorized/scientist/items/index.html' }
        }
      })

      .state('authorized.scientist.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/scientist/items/list.html' }
        }
      })

      .state('authorized.scientist.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/scientist/items/new.html' }
        }
      })

      .state('authorized.scientist.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/scientist/items/edit.html' }
        }
      })

      .state('authorized.scientist.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/scientist/items/show.html' }
        }
      })

      ;

  }]);
}());

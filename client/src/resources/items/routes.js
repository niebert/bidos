/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.item.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.items', {
        url: '/items/:domainId',
        views: {
          main: { templateUrl: 'resources/items/views/index.html' }
        }
      })

      .state('auth.items.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/items/views/list.html' }
        }
      })

      .state('auth.items.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/items/views/new.html' }
        }
      })

      .state('auth.items.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/items/views/edit.html' }
        }
      })

      .state('auth.items.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/items/views/show.html' }
        }
      })

      ;

  }]);
}());

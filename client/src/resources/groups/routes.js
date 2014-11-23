/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.group.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'resources/groups/views/index.html' }
        }
      })

      .state('auth.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/groups/views/list.html' }
        }
      })

      .state('auth.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/groups/views/new.html' }
        }
      })

      .state('auth.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/groups/views/edit.html' }
        }
      })

      .state('auth.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/groups/views/show.html' }
        }
      })

      ;

  }]);
}());

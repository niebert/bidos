/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.kid.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'resources/kids/views/index.html' }
        }
      })

      .state('auth.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/kids/views/list.html' }
        }
      })

      .state('auth.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/kids/views/new.html' }
        }
      })

      .state('auth.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/kids/views/edit.html' }
        }
      })

      .state('auth.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/kids/views/show.html' }
        }
      })

      ;

  }]);
}());

/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.kid.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'resources/kids/views/index.html' }
        }
      })

      .state('auth.admin.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/kids/views/list.html' }
        }
      })

      .state('auth.admin.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/kids/views/new.html' }
        }
      })

      .state('auth.admin.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/kids/views/edit.html' }
        }
      })

      .state('auth.admin.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/kids/views/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'resources/kids/views/index.html' }
        }
      })

      .state('auth.practitioner.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/kids/views/list.html' }
        }
      })

      .state('auth.practitioner.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/kids/views/new.html' }
        }
      })

      .state('auth.practitioner.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/kids/views/edit.html' }
        }
      })

      .state('auth.practitioner.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/kids/views/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'resources/kids/views/index.html' }
        }
      })

      .state('auth.scientist.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/kids/views/list.html' }
        }
      })

      .state('auth.scientist.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/kids/views/new.html' }
        }
      })

      .state('auth.scientist.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/kids/views/edit.html' }
        }
      })

      .state('auth.scientist.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/kids/views/show.html' }
        }
      })

      ;

  }]);
}());

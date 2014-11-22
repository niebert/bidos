/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.group.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'resources/groups/views/index.html' }
        }
      })

      .state('auth.admin.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/groups/views/list.html' }
        }
      })

      .state('auth.admin.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/groups/views/new.html' }
        }
      })

      .state('auth.admin.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/groups/views/edit.html' }
        }
      })

      .state('auth.admin.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/groups/views/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'resources/groups/views/index.html' }
        }
      })

      .state('auth.practitioner.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/groups/views/list.html' }
        }
      })

      .state('auth.practitioner.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/groups/views/new.html' }
        }
      })

      .state('auth.practitioner.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/groups/views/edit.html' }
        }
      })

      .state('auth.practitioner.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/groups/views/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'resources/groups/views/index.html' }
        }
      })

      .state('auth.scientist.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/groups/views/list.html' }
        }
      })

      .state('auth.scientist.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/groups/views/new.html' }
        }
      })

      .state('auth.scientist.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/groups/views/edit.html' }
        }
      })

      .state('auth.scientist.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/groups/views/show.html' }
        }
      })

      ;

  }]);
}());

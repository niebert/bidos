/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.groups.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'auth/admin/groups/index.html' }
        }
      })

      .state('auth.admin.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/admin/groups/list.html' }
        }
      })

      .state('auth.admin.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/admin/groups/new.html' }
        }
      })

      .state('auth.admin.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/admin/groups/edit.html' }
        }
      })

      .state('auth.admin.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/admin/groups/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'auth/practitioner/groups/index.html' }
        }
      })

      .state('auth.practitioner.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/practitioner/groups/list.html' }
        }
      })

      .state('auth.practitioner.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/practitioner/groups/new.html' }
        }
      })

      .state('auth.practitioner.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/practitioner/groups/edit.html' }
        }
      })

      .state('auth.practitioner.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/practitioner/groups/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'auth/scientist/groups/index.html' }
        }
      })

      .state('auth.scientist.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/scientist/groups/list.html' }
        }
      })

      .state('auth.scientist.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/scientist/groups/new.html' }
        }
      })

      .state('auth.scientist.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/scientist/groups/edit.html' }
        }
      })

      .state('auth.scientist.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/scientist/groups/show.html' }
        }
      })

      ;

  }]);
}());

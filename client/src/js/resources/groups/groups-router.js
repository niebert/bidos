/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.groups.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('authorized.admin.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'authorized/admin/groups/index.html' }
        }
      })

      .state('authorized.admin.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/admin/groups/list.html' }
        }
      })

      .state('authorized.admin.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/admin/groups/new.html' }
        }
      })

      .state('authorized.admin.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/admin/groups/edit.html' }
        }
      })

      .state('authorized.admin.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/admin/groups/show.html' }
        }
      })



      // PRACTITIONER

      .state('authorized.practitioner.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'authorized/practitioner/groups/index.html' }
        }
      })

      .state('authorized.practitioner.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/practitioner/groups/list.html' }
        }
      })

      .state('authorized.practitioner.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/practitioner/groups/new.html' }
        }
      })

      .state('authorized.practitioner.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/practitioner/groups/edit.html' }
        }
      })

      .state('authorized.practitioner.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/practitioner/groups/show.html' }
        }
      })



      // SCIENTIST

      .state('authorized.scientist.groups', {
        url: '/groups',
        views: {
          main: { templateUrl: 'authorized/scientist/groups/index.html' }
        }
      })

      .state('authorized.scientist.groups.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/scientist/groups/list.html' }
        }
      })

      .state('authorized.scientist.groups.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/scientist/groups/new.html' }
        }
      })

      .state('authorized.scientist.groups.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/scientist/groups/edit.html' }
        }
      })

      .state('authorized.scientist.groups.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/scientist/groups/show.html' }
        }
      })

      ;

  }]);
}());

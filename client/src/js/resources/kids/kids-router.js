/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.kids.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'auth/admin/kids/index.html' }
        }
      })

      .state('auth.admin.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/admin/kids/list.html' }
        }
      })

      .state('auth.admin.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/admin/kids/new.html' }
        }
      })

      .state('auth.admin.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/admin/kids/edit.html' }
        }
      })

      .state('auth.admin.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/admin/kids/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'auth/practitioner/kids/index.html' }
        }
      })

      .state('auth.practitioner.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/practitioner/kids/list.html' }
        }
      })

      .state('auth.practitioner.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/practitioner/kids/new.html' }
        }
      })

      .state('auth.practitioner.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/practitioner/kids/edit.html' }
        }
      })

      .state('auth.practitioner.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/practitioner/kids/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'auth/scientist/kids/index.html' }
        }
      })

      .state('auth.scientist.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/scientist/kids/list.html' }
        }
      })

      .state('auth.scientist.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/scientist/kids/new.html' }
        }
      })

      .state('auth.scientist.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/scientist/kids/edit.html' }
        }
      })

      .state('auth.scientist.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/scientist/kids/show.html' }
        }
      })

      ;

  }]);
}());

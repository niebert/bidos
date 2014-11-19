/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.surveys.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'auth/admin/surveys/index.html' }
        }
      })

      .state('auth.admin.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/admin/surveys/list.html' }
        }
      })

      .state('auth.admin.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/admin/surveys/new.html' }
        }
      })

      .state('auth.admin.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/admin/surveys/edit.html' }
        }
      })

      .state('auth.admin.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/admin/surveys/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'auth/practitioner/surveys/index.html' }
        }
      })

      .state('auth.practitioner.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/practitioner/surveys/list.html' }
        }
      })

      .state('auth.practitioner.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/practitioner/surveys/new.html' }
        }
      })

      .state('auth.practitioner.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/practitioner/surveys/edit.html' }
        }
      })

      .state('auth.practitioner.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/practitioner/surveys/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'auth/scientist/surveys/index.html' }
        }
      })

      .state('auth.scientist.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'auth/scientist/surveys/list.html' }
        }
      })

      .state('auth.scientist.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'auth/scientist/surveys/new.html' }
        }
      })

      .state('auth.scientist.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'auth/scientist/surveys/edit.html' }
        }
      })

      .state('auth.scientist.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'auth/scientist/surveys/show.html' }
        }
      })

      ;

  }]);
}());

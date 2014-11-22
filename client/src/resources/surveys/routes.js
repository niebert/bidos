/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.survey.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.admin.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'resources/surveys/views/index.html' }
        }
      })

      .state('auth.admin.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/surveys/views/list.html' }
        }
      })

      .state('auth.admin.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/surveys/views/new.html' }
        }
      })

      .state('auth.admin.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/surveys/views/edit.html' }
        }
      })

      .state('auth.admin.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/surveys/views/show.html' }
        }
      })



      // PRACTITIONER

      .state('auth.practitioner.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'resources/surveys/views/index.html' }
        }
      })

      .state('auth.practitioner.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/surveys/views/list.html' }
        }
      })

      .state('auth.practitioner.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/surveys/views/new.html' }
        }
      })

      .state('auth.practitioner.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/surveys/views/edit.html' }
        }
      })

      .state('auth.practitioner.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/surveys/views/show.html' }
        }
      })



      // SCIENTIST

      .state('auth.scientist.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'resources/surveys/views/index.html' }
        }
      })

      .state('auth.scientist.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/surveys/views/list.html' }
        }
      })

      .state('auth.scientist.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/surveys/views/new.html' }
        }
      })

      .state('auth.scientist.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/surveys/views/edit.html' }
        }
      })

      .state('auth.scientist.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/surveys/views/show.html' }
        }
      })

      ;

  }]);
}());

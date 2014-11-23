/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.survey.routes', [])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // ADMIN

      .state('auth.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'resources/surveys/views/index.html' }
        }
      })

      .state('auth.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'resources/surveys/views/list.html' }
        }
      })

      .state('auth.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'resources/surveys/views/new.html' }
        }
      })

      .state('auth.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'resources/surveys/views/edit.html' }
        }
      })

      .state('auth.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'resources/surveys/views/show.html' }
        }
      })

      ;

  }]);
}());

/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.surveys.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('authorized.admin.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'authorized/admin/surveys/index.html' }
        }
      })

      .state('authorized.admin.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/admin/surveys/list.html' }
        }
      })

      .state('authorized.admin.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/admin/surveys/new.html' }
        }
      })

      .state('authorized.admin.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/admin/surveys/edit.html' }
        }
      })

      .state('authorized.admin.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/admin/surveys/show.html' }
        }
      })



      // PRACTITIONER

      .state('authorized.practitioner.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'authorized/practitioner/surveys/index.html' }
        }
      })

      .state('authorized.practitioner.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/practitioner/surveys/list.html' }
        }
      })

      .state('authorized.practitioner.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/practitioner/surveys/new.html' }
        }
      })

      .state('authorized.practitioner.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/practitioner/surveys/edit.html' }
        }
      })

      .state('authorized.practitioner.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/practitioner/surveys/show.html' }
        }
      })



      // SCIENTIST

      .state('authorized.scientist.surveys', {
        url: '/surveys',
        views: {
          main: { templateUrl: 'authorized/scientist/surveys/index.html' }
        }
      })

      .state('authorized.scientist.surveys.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/scientist/surveys/list.html' }
        }
      })

      .state('authorized.scientist.surveys.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/scientist/surveys/new.html' }
        }
      })

      .state('authorized.scientist.surveys.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/scientist/surveys/edit.html' }
        }
      })

      .state('authorized.scientist.surveys.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/scientist/surveys/show.html' }
        }
      })

      ;

  }]);
}());

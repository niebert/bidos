/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resources.kids.router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // ADMIN

      .state('authorized.admin.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'authorized/admin/kids/index.html' }
        }
      })

      .state('authorized.admin.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/admin/kids/list.html' }
        }
      })

      .state('authorized.admin.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/admin/kids/new.html' }
        }
      })

      .state('authorized.admin.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/admin/kids/edit.html' }
        }
      })

      .state('authorized.admin.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/admin/kids/show.html' }
        }
      })



      // PRACTITIONER

      .state('authorized.practitioner.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'authorized/practitioner/kids/index.html' }
        }
      })

      .state('authorized.practitioner.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/practitioner/kids/list.html' }
        }
      })

      .state('authorized.practitioner.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/practitioner/kids/new.html' }
        }
      })

      .state('authorized.practitioner.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/practitioner/kids/edit.html' }
        }
      })

      .state('authorized.practitioner.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/practitioner/kids/show.html' }
        }
      })



      // SCIENTIST

      .state('authorized.scientist.kids', {
        url: '/kids',
        views: {
          main: { templateUrl: 'authorized/scientist/kids/index.html' }
        }
      })

      .state('authorized.scientist.kids.list', {
        url: '/list',
        views: {
          main: { templateUrl: 'authorized/scientist/kids/list.html' }
        }
      })

      .state('authorized.scientist.kids.new', {
        url: '/new',
        views: {
          main: { templateUrl: 'authorized/scientist/kids/new.html' }
        }
      })

      .state('authorized.scientist.kids.edit', {
        url: '/edit',
        views: {
          main: { templateUrl: 'authorized/scientist/kids/edit.html' }
        }
      })

      .state('authorized.scientist.kids.show', {
        url: '/show',
        views: {
          main: { templateUrl: 'authorized/scientist/kids/show.html' }
        }
      })

      ;

  }]);
}());

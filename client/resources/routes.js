/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.routes', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // main route for anything authenticated
      .state('auth', {
        url: '',
        templateUrl: 'layout.html'
      })

      // most of practitioners stuff happens here
      .state('auth.home', {
        url: '/home',
        views: {
          main: { templateUrl: 'home.html' }
        }
      })

      .state('auth.profile', {
        url: '/profile',
        views: {
          main: { templateUrl: 'resources/templates/profile.html' }
        }
      })

      .state('auth.help', {
        url: '/help',
        views: {
          main: { templateUrl: 'resources/templates/help.html' }
        }
      })

      .state('auth.logout', {
        url: '/logout',
        views: {
          main: { templateUrl: 'resources/templates/logout.html' }
        }
      })


      /* Kid
         --------------------------------------------------------*/

      .state('auth.kid', {
        url: '/kid',
        views: {
          main: { templateUrl: 'resources/templates/kid.table.html' }
        }
      })


      /* Item
         --------------------------------------------------------*/

      .state('auth.item', {
        url: '/item',
        views: {
          main: { templateUrl: 'resources/templates/item.table.html' }
        }
      })


      /* Observation
         --------------------------------------------------------*/

      .state('auth.observation', {
        url: '/observation',
        views: {
          main: { templateUrl: 'resources/templates/observation.table.html' }
        }
      })


      /* User
         --------------------------------------------------------*/

      .state('auth.user', {
        url: '/user',
        views: {
          main: { templateUrl: 'resources/templates/user.table.html' }
        }
      })


      /* Group
         --------------------------------------------------------*/

      .state('auth.group', {
        url: '/group',
        views: {
          main: { templateUrl: 'resources/assets/group.table.html' }
        }
      })


      ;

  }]);
}());

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
        url: '/home/kid=:kidId&item=:itemId',
        views: {
          main: { templateUrl: 'home.html' }
        }
      })


      // most of practitioners stuff happens here
      .state('auth.dashboard', {
        url: '/dashboard/kid=:kidId&item=:itemId',
        views: {
          main: { templateUrl: 'dashboard.html' }
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

      // .state('auth.kid', {
      //   url: '/kid',
      //   views: {
      //     main: { templateUrl: 'resources/assets/kid.index.html' }
      //   }
      // })

      // .state('auth.item', {
      //   url: '/item',
      //   abstract: true,
      //   views: {
      //     main: { templateUrl: 'resources/assets/item.do.html' }
      //   }
      // })

      // .state('auth.item.selectBehaviour', {
      //   url: '/:itemId/select',
      //   views: {
      //     main: { templateUrl: 'resources/assets/item.selectBehaviour.html' }
      //   }
      // })

      // .state('auth.item.reviewObservation', {
      //   url: '/:itemId/review',
      //   // template: 'resources/assets/item.do.html'
      //   views: {
      //     main: { templateUrl: 'resources/assets/item.review.html' }
      //   }
      // })

      // .state('auth.item.table', {
      //   url: '/table',
      //   views: {
      //     main: { templateUrl: 'resources/assets/item.table.html' }
      //   }
      // })

      // .state('auth.item.show', {
      //   url: '/:id',
      //   views: {
      //     main: { templateUrl: 'resources/assets/item.show.html' }
      //   }
      // })


      ;

  }]);
}());

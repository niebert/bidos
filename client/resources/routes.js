/* global angular */

(function() {
  'use strict';

  angular.module('bidos')

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // main route for anything authenticated
      .state('auth', {
        url: '',
        templateUrl: 'layout.html'
      })

      // kind of a dashboard
      .state('auth.home', {
        url: '/home',
        views: {
          main: { template: '<bidos-dashboard></bidos-dashboard>' }
        }
      })

      // .state('auth.profile', {
      //   url: '/profile',
      //   views: {
      //     main: { templateUrl: 'resources/templates/profile.html' }
      //   }
      // })

      // .state('auth.help', {
      //   url: '/help',
      //   views: {
      //     main: { templateUrl: 'resources/templates/help.html' }
      //   }
      // })

      // .state('auth.logout', {
      //   url: '/logout',
      //   views: {
      //     main: { templateUrl: 'resources/templates/logout.html' }
      //   }
      // })


      // .state('auth.stats', {
      //   url: '/stats',
      //   views: {
      //     main: { templateUrl: 'resources/templates/stats.html' }
      //   }
      // })


      /* Kid
         --------------------------------------------------------*/

      // .state('auth.kid', {
      //   url: '/kid',
      //   views: {
      //     main: { templateUrl: 'resources/templates/kid.table.html' }
      //   }
      // })

      .state('auth.kids', {
        url: '/kids',
        views: {
          main: { template: '<bidos-kids></bidos-kids>' }
        }
      })


      /* Item
         --------------------------------------------------------*/

      // .state('auth.item', {
      //   url: '/item',
      //   views: {
      //     main: { templateUrl: 'resources/templates/item.table.html' }
      //   }
      // })


      /* Observation
         --------------------------------------------------------*/

      // .state('auth.observation', {
      //   url: '/observation',
      //   views: {
      //     main: { templateUrl: 'resources/templates/observation.table.html' }
      //   }
      // })


      /* User
         --------------------------------------------------------*/

      // .state('auth.user', {
      //   url: '/user',
      //   views: {
      //     main: { templateUrl: 'resources/templates/user.table.html' }
      //   }
      // })


      /* Group
         --------------------------------------------------------*/

      // .state('auth.group', {
      //   url: '/group',
      //   views: {
      //     main: { templateUrl: 'resources/assets/group.table.html' }
      //   }
      // })


      ;

  }]);
}());

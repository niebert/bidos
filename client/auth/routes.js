/* global angular */

(function() {
  'use strict';

  angular.module('auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

    /* Public routes to authenticate. All other routes are private. */

      .state('public', {
      url: '',
      templateUrl: 'auth/views/layout.html'
    })

    .state('public.login', {
      url: '/login',
      views: {
        main: {
          templateUrl: 'auth/views/login.html'
        }
      }
    })

    .state('public.signup', {
      url: '/signup',
      views: {
        main: {
          templateUrl: 'auth/views/signup.html'
        }
      }
    })

    .state('public.thankyou', {
      url: '/thankyou',
      views: {
        main: {
          templateUrl: 'auth/views/thankyou.html'
        }
      }
    })

    .state('public.forgot', {
      url: '/forgot',
      views: {
        main: {
          templateUrl: 'auth/views/forgot.html'
        }
      }
    })

    .state('public.reset', {
      url: '/reset/:hash',
      views: {
        main: {
          templateUrl: 'auth/views/reset.html'
        }
      }
    })

    ;

  }]);
}());

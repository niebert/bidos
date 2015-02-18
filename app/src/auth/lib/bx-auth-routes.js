/* global angular */

(function() {
  'use strict';

  angular.module('bx.auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

    /* Public routes to authenticate. All other routes are private. */

      .state('public', {
      url: '',
      templateUrl: 'templates/bx-auth-layout.html'
    })

    .state('public.login', {
      url: '/login',
      views: {
        main: {
          templateUrl: 'templates/bx-auth-login.html'
        }
      }
    })

    .state('public.signup', {
      url: '/signup',
      views: {
        main: {
          templateUrl: 'templates/bx-auth-signup.html'
        }
      }
    })

    .state('public.thankyou', {
      url: '/thankyou',
      views: {
        main: {
          templateUrl: 'templates/bx-auth-thankyou.html'
        }
      }
    })

    .state('public.forgot', {
      url: '/forgot',
      views: {
        main: {
          templateUrl: 'templates/bx-auth-forgot.html'
        }
      }
    })

    .state('public.reset', {
      url: '/reset/:hash',
      views: {
        main: {
          templateUrl: 'templates/bx-auth-reset.html'
        }
      }
    })

    ;

  }]);
}());

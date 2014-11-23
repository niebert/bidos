/* global angular */

(function() {
  'use strict';

  angular.module('auth.router', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider

      // THE ALL EMBRACING AUTH ROUTE: all subsequent routes inherit it's
      // controller, as every connection must be authenticated

      // PUBLIC ROUTES

      .state('public', {
        url: '',
        templateUrl: 'auth/views/layout.html'
      })

      .state('public.login', {
        url: '/login',
        views: {
          main: { templateUrl: 'auth/views/login.html' }
        }
      })

      .state('public.signup', {
        url: '/signup',
        views: {
          main: { templateUrl: 'auth/views/signup.html' }
        }
      })

      // AUTHORIZED

      // why tf is the controller sometimes recognized when it's set up here,
      // like below and sometimes when it's added directly to the element...
      // and sometimes vice versa.

      // TODO: break out separate menu

      .state('auth', {
        url: '',
        templateUrl: 'layout.html'
      })
      ;

  }]);
}());

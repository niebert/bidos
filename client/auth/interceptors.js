/* global angular, localStorage */

(function() {
  'use strict';

  require('./constants');

  angular.module('auth.interceptor', [
    'auth.constants',
    'angular-jwt', // json web token
  ])

  .config(function($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      var token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        console.warn('no auth token present');
      }

      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  });


}());

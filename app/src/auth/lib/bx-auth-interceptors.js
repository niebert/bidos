/* global angular, localStorage */

(function() {
  'use strict';

  var TOKEN_KEY = require('../../config').app.TOKEN_KEY;

  angular.module('bx.auth.interceptor', [
    'angular-jwt', // json web token
  ])

  .config(function($httpProvider, jwtInterceptorProvider) {
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

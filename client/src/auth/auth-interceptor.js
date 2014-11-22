/* global angular, localStorage */

(function() {
  'use strict';

  require('./auth-constants');

  angular.module('auth.interceptor', [
    'auth.constants',
    'angular-jwt', // json web token
  ])

  .config(['$httpProvider', 'jwtInterceptorProvider', 'TOKEN_KEY',
    function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  }]);


}());

/* global angular, localStorage */
angular.module('auth.interceptor', [
  'angular-jwt' // json web token
])

.config(function($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function() {
    var token = localStorage.getItem('auth_token'); // FIXME

    if (!token) {
      console.warn('no auth token present');
    }

    return localStorage.getItem('auth_token'); // FIXME
  };

  $httpProvider.interceptors.push('jwtInterceptor');
});

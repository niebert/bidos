/* global angular */
require('./lib/auth-interceptors');
require('./lib/auth-services');
require('./lib/auth-controllers');
require('./lib/auth-routes');

angular.module('auth', [
  'auth.interceptor',
  'auth.services',
  'auth.controller',
  'auth.router'
]);

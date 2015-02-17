/* global angular */

(function() {
  'use strict';

  require('./lib/bx-auth-interceptors');
  require('./lib/bx-auth-services');
  require('./lib/bx-auth-controllers');
  require('./lib/bx-auth-routes');

  angular.module('auth', [
    'bx.auth.interceptor',
    'bx.auth.services',
    'bx.auth.controller',
    'bx.auth.router',
  ]);

}());

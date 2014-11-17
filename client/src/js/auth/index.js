/* global angular */

(function() {
  'use strict';

  require('./auth-interceptor');
  require('./auth-services');
  require('./auth-controller');
  require('./auth-router');

  angular.module('auth', [
    'auth.interceptor',
    'auth.services',
    'auth.controller',
    'auth.router',
  ]);

}());

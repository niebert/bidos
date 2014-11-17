/* global angular */

(function() {
  'use strict';

  require('./auth-interceptor');
  require('./auth-services');
  require('./auth-controller');

  angular.module('auth', [
    'auth.interceptor',
    'auth.services',
    'auth.controller',
  ]);

}());

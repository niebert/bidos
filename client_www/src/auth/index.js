/* global angular */

(function() {
  'use strict';

  require('./interceptors');
  require('./services');
  require('./controllers');
  require('./routes');

  angular.module('auth', [
    'auth.interceptor',
    'auth.services',
    'auth.controller',
    'auth.router',
  ]);

}());

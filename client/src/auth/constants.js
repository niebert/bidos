/* global angular */

(function() {
  'use strict';

  angular.module('auth.constants', [])

  .constant('TOKEN_KEY', 'auth_token')
  .constant('API_URL', 'http://localhost:3000');

}());

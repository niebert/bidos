/* global angular */

(function() {
  'use strict';

  angular.module('auth.constants', [])

  .constant('TOKEN_KEY', 'auth_token')
  .constant('API_URL', 'http://141.26.69.238/bidos'); // no /v1 here, FIXME
  // .constant('API_URL', 'http://192.168.1.7:3000'); // no /v1 here, FIXME

}());

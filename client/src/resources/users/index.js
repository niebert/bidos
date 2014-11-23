/* global angular */

(function() {
  'use strict';

  require('./routes');
  require('./controller');

  angular.module('bidos.resource.user', [
    'bidos.resource.user.routes',
    'bidos.resource.user.controller'
  ]);

}());

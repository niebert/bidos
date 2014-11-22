/* global angular */

(function() {
  'use strict';

  require('./routes');

  angular.module('bidos.resource.user', [
    'bidos.resource.user.routes',
  ]);

}());

/* global angular */

(function() {
  'use strict';

  require('./routes');

  angular.module('bidos.resource.kid', [
    'bidos.resource.kid.routes',
  ]);

}());

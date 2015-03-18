(function() {
  'use strict';
  /* global angular */

  angular.module('bidos').constant('CONFIG', require('../api/config'));
  angular.module('bidos').constant('STRINGS', require('./strings'));
}());

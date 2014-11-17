/* global angular */

(function() {
  'use strict';

  require('./kids-controller');
  require('./kids-router');

  angular.module('bidos.resources.kids', [
    'bidos.resources.kids.controller',
    'bidos.resources.kids.router',
  ]);

}());

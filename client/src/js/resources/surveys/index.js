/* global angular */

(function() {
  'use strict';

  require('./surveys-controller');
  require('./surveys-router');

  angular.module('bidos.resources.surveys', [
    'bidos.resources.surveys.controller',
    'bidos.resources.surveys.router',
  ]);

}());

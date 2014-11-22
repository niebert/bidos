/* global angular */

(function() {
  'use strict';

  require('./surveys-router');

  angular.module('bidos.resources.surveys', [
    'bidos.resources.surveys.router',
  ]);

}());

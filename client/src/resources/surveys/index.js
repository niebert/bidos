/* global angular */

(function() {
  'use strict';

  require('./routes');

  angular.module('bidos.resource.survey', [
    'bidos.resource.survey.routes',
  ]);

}());

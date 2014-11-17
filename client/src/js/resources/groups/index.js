/* global angular */

(function() {
  'use strict';

  require('./groups-controller');
  require('./groups-router');

  angular.module('bidos.resources.groups', [
    'bidos.resources.groups.controller',
    'bidos.resources.groups.router',
  ]);

}());

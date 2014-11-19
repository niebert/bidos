/* global angular */

(function() {
  'use strict';

  require('./groups-router');

  angular.module('bidos.resources.groups', [
    'bidos.resources.groups.router',
  ]);

}());

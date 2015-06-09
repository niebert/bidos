'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosExport', bidosExport);

function bidosExport() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'ExportController',
    templateUrl: '/templates/export.html'
  };
}


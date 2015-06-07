'use strict';
/* global angular */
angular.module('bidos')
  .directive('bidosCapture', bidosCapture);

function bidosCapture() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'CaptureController',
    templateUrl: '/templates/capture.html'
  };
}

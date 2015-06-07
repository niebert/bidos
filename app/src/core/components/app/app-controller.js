'use strict';
/* global angular */
angular.module('bidos')
.controller('AppController', AppController);

function AppController(Resources) {
  Resources.init();
}

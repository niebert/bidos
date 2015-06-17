'use strict';
/* global angular */
angular.module('bidos')
.controller('AppController', AppController);

function AppController(Resources) {
	console.log('init resources in app controller');
  Resources.init();
}

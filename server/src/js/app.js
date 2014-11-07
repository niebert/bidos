(function() {
  'use strict';

  require('./auth');
  require('./router');

  var app = angular.module('rw', [
  	'rw.auth',
  	'rw.router'
  ]);

}());

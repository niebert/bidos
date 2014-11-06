(function() {
  'use strict';

  require('./rw-react');
  require('./rw-auth');
  require('./rw-router');

  var app = angular.module('rw', [
  	'rw.react',
  	'rw.auth',
  	'rw.router'
  ]);

}());

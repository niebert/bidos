/* global angular */

(function() {
  'use strict';

  require('lodash');
  require('./routes');
  require('./controllers');
  require('./filters');
  require('./directives/index');

  require('./assets/user');

  var app = angular.module('bidos.resource', [
    'bidos.filter',
    'bidos.resource.routes',
    'bidos.resource.controllers',
    'bidos.resource.directives',

    'bidos.user',
  ]);

  app.run(function($rootScope) {

    if (navigator.onLine) {
      console.log("%cONLINE", "color: green; font-size: 1.2em");
    } else {
      console.log("%cOFFLINE", "color: red; font-size: 1.2em");
    }

    $rootScope.online = navigator.onLine ? 'online' : 'offline';
    $rootScope.$apply();

    if (window.addEventListener) {
      window.addEventListener("online", function() {
        $rootScope.online = "online";
        $rootScope.$apply();
      }, true);
      window.addEventListener("offline", function() {
        $rootScope.online = "offline";
        $rootScope.$apply();
      }, true);
    } else {
      document.body.ononline = function() {
        $rootScope.online = "online";
        $rootScope.$apply();
      };
      document.body.onoffline = function() {
        $rootScope.online = "offline";
        $rootScope.$apply();
      };
    }
  });

}());

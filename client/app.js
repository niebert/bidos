/* global angular, navigator, window */

(function() {
  'use strict';

  var app = angular.module('bidos', [
    'auth',
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'LocalForageModule'
    // 'pouchdb'
  ]);

  require('./auth');
  require('./resources/controllers/md-sidenav-controller.js');
  require('./resources');



  app.constant('API_URL', 'http://localhost:3000');
  // app.constant('API_URL', 'http://192.168.2.9:3000');
  // app.constant('API_URL', 'http://192.168.1.7:3000');
  // app.constant('API_URL', 'http://bidos.sci-hub.ir:3000');



  /* Register event listeners to keep track of our network status and make it
  /* available on $rootScope.networkStatus. */

  app.run(function($rootScope) {

    if (navigator.onLine) {
      console.log('%cONLINE', 'color: green; font-size: 1.2em');
    } else {
      console.log('%cOFFLINE', 'color: red; font-size: 1.2em');
    }

    $rootScope.networkStatus = navigator.onLine ? 'online' : 'offline';
    $rootScope.$apply();

    if (window.addEventListener) {

      window.addEventListener('online', function() {
        $rootScope.networkStatus = 'online';
        $rootScope.$apply();
      }, true);

      window.addEventListener('offline', function() {
        $rootScope.networkStatus = 'offline';
        $rootScope.$apply();
      }, true);

    } else {

      document.body.ononline = function() {
        $rootScope.networkStatus = 'online';
        $rootScope.$apply();
      };

      document.body.onoffline = function() {
        $rootScope.networkStatus = 'offline';
        $rootScope.$apply();
      };

    }
  });



  app.config(function($logProvider) {
    $logProvider.debugEnabled(true);
  });

  app.run(function($rootScope, $log) {
    $rootScope.$log = $log;
  });

}());

/* global angular, navigator, window, document */

(function() {
  'use strict';

  var app = angular.module('bidos', [
    'auth',
    'ngMaterial',
    'ngMessages',
    'ngStorage',
    'ui.router',
    // 'ngCordova',
    // 'LocalForageModule'
    // 'pouchdb'
  ]);

  require('./auth');
  require('./bidos-core');

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

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
      return {
        'request': function(config) {
          $rootScope.$broadcast('loading-started');
          return config || $q.when(config);
        },
        'response': function(response) {
          $rootScope.$broadcast('loading-complete');
          return response || $q.when(response);
        }
      };
    });
  });

  app.directive('loadingIndicator', function() {
    return {
      restrict: 'A',
      template: '<md-progress-linear class="md-warn" md-mode="indeterminate"></md-progress-linear>',
      link: function(scope, element, attrs) {
        scope.$on('loading-started', function(e) {
          element.css({
            'display': ''
          });
        });
        scope.$on('loading-complete', function(e) {
          element.css({
            'display': 'none'
          });
        });
      }
    };
  });


}());

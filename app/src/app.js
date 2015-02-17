(function() {
  'use strict';
  /* global angular, navigator, window, document */

  var app = angular.module('bidos', [
    'auth', // bidos auth

    'ngMaterial', // material design
    'ngMessages', // form error messages
    'ngStorage', // offline storage

    'ui.router',
    'chart.js',
  ]);

  // bidos here
  require('./core');
  require('./auth');

  // TODO clean up the junkyard below

  app.config(function($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.
    $mdIconProvider
      .defaultIconSet('my/app/icons.svg') // Register a default set of SVG icons
      .iconSet('social', 'my/app/social.svg') // Register a named icon set of SVGs
      .icon('android', 'lib/material-design-icons/action/svg/design/ic_android_48px.svg') // Register a specific icon (by name)
      .icon('work:chair', 'my/app/chair.svg'); // Register icon in a specific set
  });

  app.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('light-blue');
  }]);

  /* Register event listeners to keep track of our network status and make it
  /* available on $rootScope.networkStatus. */

  // NOTE neccessary to download json as blob (export fun)
  app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
  }]);

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

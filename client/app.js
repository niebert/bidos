/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');

  var app = angular.module('bidos', [
    'auth',
    'bidos.resource', // <-- singular
    'ng-polymer-elements',
    'ngMaterial',
    'ngMessages'
  ]);

  app.constant('API_URL', 'http://192.168.1.7:3000');
  // app.constant('API_URL', 'http://bidos.sci-hub.ir:3000');

  // app.run(function($rootScope) {
  //   $rootScope.$on('$routeChangeSuccess', function(ev,data) {
  //     if (data.$route && data.$route.controller) {
  //       $rootScope.controller = data.$route.controller;
  //     }
  //   });
  // });

  // app.run(function($rootScope) {
  //   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
  //     $rootScope.params = toParams;
  //     // select domain/subdomain/item here based on toParams obj
  //   });
  // }

app.config(function($logProvider) {
    $logProvider.debugEnabled(false);
});

app.run(function($rootScope, $log) {
    $rootScope.$log = $log;
});

app.controller("foo", function($scope) {
  $scope.myFunc = function(ev) {
  };
});

}());

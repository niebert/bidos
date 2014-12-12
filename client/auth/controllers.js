/* jshint unused:false */
/* global angular */
/* exported AuthController */

(function() {
  'use strict';

  require('./services');

  angular.module('auth.controller', [])
  .controller('AuthController', AuthController);

  function AuthController($rootScope, $scope, UserFactory, $state) {

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state = toState.name;
    });

    // init: decrypt auth token and check if we're authenticated
    UserFactory.getUser()
    .then(function authorized(user) {
      console.info('[AuthController] authorized');
      $rootScope.auth = user;
      $state.go('auth.home');
    }, function unauthorized() {
      console.warn('[AuthController] not authorized');
      $state.go('public.login');
    });

    $scope.login = function(credentials) {
      console.log('[AuthController] $scope.login', credentials);
      UserFactory.login(credentials)
      .then(function authorized(response) {
        $rootScope.auth = response.data;
        $state.go('auth.home');
      }, handleError);
    };

    $scope.logout = function() {
      console.log('[AuthController] $scope.logout');
      UserFactory.logout()
      .then(function() {
        $state.go('public.goodbye');
        $rootScope.auth = null;
      }, handleError);
    };

    $scope.signup = function(formData) {
      console.log('[AuthController] $scope.signup', formData);
      UserFactory.signup(formData)
      .then(function(response) {
        $state.go('public.thankyou');
      }, handleError);
    };

    function handleError(response) {
      console.info('[AuthController] ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }

}());
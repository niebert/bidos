/* jshint unused:false */
/* global angular */
/* exported authCtrl */

(function() {
  'use strict';

  require('./services');

  angular.module('auth.controller', [])
  .controller('authCtrl', authCtrl);

  function authCtrl($rootScope, $scope, UserFactory, $state) {

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state = toState.name;
    });

    console.log('[authCtrl] $rootScope.state', $rootScope.state);
    console.log('[authCtrl] $rootScope.auth ', $rootScope.auth);

    // init: decrypt auth token and check if we're authenticated
    UserFactory.getUser()
    .then(function authorized(user) {
      console.info('[authCtrl] authorized');
      $rootScope.auth = user;
      // $state.go('auth.' + user.role) // really?
      $state.go('auth');
    }, function unauthorized() {
      console.warn('[authCtrl] not authorized');
      $state.go('public.login');
    });

    $scope.login = function(credentials) {
      console.log('[authCtrl] $scope.login', credentials);
      UserFactory.login(credentials)
      .then(function authorized(response) {
        $rootScope.auth = response.data;
        $state.go('auth.items', {'domainId': 0}); // FIXME
      }, handleError);
    };

    $scope.logout = function() {
      console.log('[authCtrl] $scope.logout');
      UserFactory.logout()
      .then(function() {
        $state.go('goodbye');
        $rootScope.auth = null;
      }, handleError);
    };

    $scope.signup = function(formData) {
      console.log('[authCtrl] $scope.signup', formData);
      UserFactory.signup(formData)
      .then(function(response) {
        $state.go('thankyou');
      }, handleError);
    };

    function handleError(response) {
      console.info('[authCtrl] ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }

}());

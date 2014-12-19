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
      console.log("%cAUTHORIZED", "color: green; font-size: 1.2em", user);
      $rootScope.auth = user;
      $state.go('auth.observation');
    }, function unauthorized() {
      console.log("%cNOT AUTHORIZED", "color: green; font-size: 1.2em, padding: 16px;");
      $state.go('public.login');
    });


    $scope.roles = [{
      id: 0,
      longName: 'Administrator',
      shortName: 'admin'
    }, {
      id: 1,
      longName: 'Practitioner',
      shortName: 'pract'
    }, {
      id: 2,
      longName: 'Scientist',
      shortName: 'scientist'
    }];

    $scope.signUpNewUserRoles = function(rolename) {
      return $scope.roles[rolename];
    };


    $scope.login = function(credentials) {
      console.log('[AuthController] $scope.login', credentials);
      UserFactory.login(credentials)
      .then(function authorized(response) {
        $rootScope.auth = response.data;
        $state.go('auth.observation');
      }, handleError);
    };

    $scope.logout = function() {
      console.log('[AuthController] $scope.logout');
      UserFactory.logout()
      .then(function() {
        $state.go('auth.observation'); // TODO thankyou/goodbye
        $rootScope.auth = null;
      }, handleError);
    };

    $scope.signup = function(formData) {
      console.log('[AuthController] $scope.signup', formData);
      // formData.password_hash = formData.password;
      UserFactory.signup(formData)
      .then(function(response) {
        $state.go('auth.observation'); // TODO thankyou/goodbye
      }, handleError);
    };

    function handleError(response) {
      console.info('[AuthController] ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }

}());

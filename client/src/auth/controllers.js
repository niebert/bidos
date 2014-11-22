/* global angular */

(function() {
  'use strict';

  require('./services');

  angular.module('auth.controller', [])
  .controller('authCtrl', ['$rootScope', '$scope', 'UserFactory', '$state', authCtrl]);

  function authCtrl($rootScope, $scope, UserFactory, $state) {

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state = toState.name;
    });

    // init
    UserFactory.getUser()
    .then(function authorized(user) {
      console.info('authorized');
      $rootScope.user = user;
      $state.go('auth.' + user.role) // really?
    }, function unauthorized() {
      console.warn('not authorized');
      $state.go('login');
    });

    $scope.login = function(credentials) {
      console.log('$scope.login', credentials);
      UserFactory.login(credentials)
      .then(function authorized(response) {
        $rootScope.user = response.data;
        $state.go('auth.' + response.data.role);
      }, handleError);
    };

    $scope.logout = function() {
      console.log('$scope.logout');
      UserFactory.logout()
      .then(function() {
        $state.go('goodbye');
        $rootScope.user = null;
      }, handleError);
    };

    $scope.signup = function(formData) {
      console.log('$scope.signup', formData);
      UserFactory.signup(formData)
      .then(function(response) {
        $state.go('thankyou');
      }, handleError);
    };

    function handleError(response) {
      console.info('ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }

}());

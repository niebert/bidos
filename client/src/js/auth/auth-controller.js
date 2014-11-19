/* global angular, alert */

// FIXME

require('./auth-services');

(function() {
  'use strict';

  angular.module('auth.controller', [])

  .controller('authCtrl', ['$rootScope', '$scope', 'UserFactory', '$state', function($rootScope, $scope, UserFactory, $state) {

    var vm = this; // view model

    $scope.bla = 'asdf';
    console.log($scope.state);
    console.log($state.current.name);

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state = toState.name;
    });

    UserFactory.getUser()
    .then(function authorized(user) {
      vm.user = user;
      console.info('vm', vm);
      console.info('authorized');
      $rootScope.user = user;
      $state.go('auth.' + user.role) // really?
    }, function unauthorized() {
      console.warn('not authorized');
      $state.go('unauthorized.login');
      console.log($state.current.name);
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
        vm.user = response.data;
      }, handleError);
    };

    function handleError(response) {
      console.info('ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }]);

}());

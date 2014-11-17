/* global angular, alert */

// FIXME

require('./auth-services');

(function() {
  'use strict';

  angular.module('auth.controller', [])

  .controller('authCtrl', ['UserFactory', '$state', function(UserFactory, $state) {

    var vm = this; // view model

    UserFactory.getUser()
    .then(function authorized(user) {
      vm.user = user;
      console.info('vm', vm);
      console.info('authorized');
      $state.go('authorized.' + user.role)
    }, function unauthorized() {
      console.warn('not authorized');
      $state.go('unauthorized.login');
    });

    vm.login = function(credentials) {
      console.log('vm.login', credentials);
      UserFactory.login(credentials)
      .then(function(response) {
        vm.user = response.data;
        $state.go('authorized.' + vm.user.role);
      }, handleError);
    };

    vm.logout = function() {
      console.log('vm.logout');
      UserFactory.logout();
      $state.go('goodbye');
      vm.user = null;
    };

    vm.signup = function(formData) {
      console.log('vm.signup', formData);
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

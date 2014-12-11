/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  angular.module('bidos.user', ['bidos.resource.services'])
  .controller('UserController', UserController);

  function UserController($scope, resourceService) {
    var vm = this;

    vm.createUser = createUser;

    $scope.newUser = {
      username: null,
      password: null,
      email: null,
      role: null,
      group: null,
      name: null,
      verified: true
    };

    function createUser(formData) {
      resourceService.create('users', formData).then(function(response) {
        _.merge(vm.resources, response);
      }, function createUserFailure(err) {
        console.warn('failed creating user', err);
      });
    }

  }

}());

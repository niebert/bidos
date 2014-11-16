(function() {
  'use strict';

  require('./user-service');

  angular.module('rw.user.controller', ['rw.user.service'])

  .controller('userCtrl',
    ['UserService', '$state',
    function(UserService, $state) {

    var vm = this;

    // post form data
    vm.create = function(userFormData) {
      console.info('user:vm.create', userFormData);
      UserService.create(userFormData).then(function(response) {
        vm.user = response.data.user;
        $state.go('view', vm.user.id);
      }, handleError);
    };

    // get 1 or * users
    vm.read = function(id) {
      console.info('user:vm.read');
      UserService.read(id).then(function(response) {
        vm.users = response.data;
        console.warn(vm.users);
      }, handleError);
    };

    // post form data
    vm.update = function(id) {
      console.info('user:vm.update');
      UserService.update(id).then(function(response) {
        vm.user = response.data.user;
        $state.go('view', vm.user.id);
      }, handleError);
    };

    vm.read();

    // destroy user in vm and db
    vm.destroy = function(id) {
      console.info('user:vm.destroy');
      UserService.destroy(id).then(function(response) {
        vm.user = response.data.user;
        $state.go('list');
      }, handleError);
    };

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

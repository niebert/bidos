(function() {
  'use strict';

  require('./user-service');

  angular.module('rw.user.controller', ['rw.user.service'])

  .controller('UserCtrl',
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
        console.warn(response);
        vm.user = response.data.user;
        $state.go('view', vm.user.id);
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

    // destroy user in vm and db
    vm.destroy = function(id) {
      console.info('user:vm.destroy');
      UserService.destroy(id).then(function(response) {
        vm.user = response.data.user;
        $state.go('list');
      }, handleError);
    };

    function handleError(response) {
      alert('Error: ' + response.data);
    }

    // init
    UserService.read().then(function(response) {
      vm.user = response.data;
      console.info('vm', vm);
    }, function error(err) {
      handleError(err);
    });

  }]);
}());

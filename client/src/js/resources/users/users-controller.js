/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../../common/crud-service');

  angular.module('bidos.resources.users.controller', ['bidos.crud-service'])

  .controller('userCtrl', ['CRUD', '$state', function(CRUD, $state) {

    var vm = this;
    vm.users = {};

    // post form data
    vm.create = function(formData) {
      console.info('CRUD.create', formData);
      CRUD.create('user', formData).then(function(response) {
        _.merge(vm.users, response.data);
      }, handleError);
    };

    // get 1 or * users
    vm.read = function(id) {
      console.info('user:vm.read');
      CRUD.read('user', id).then(function(response) {
        _.merge(vm.users, response.data);
      }, handleError);
    };

    // post form data
    vm.update = function(id, formData) {
      console.info('user:vm.update');
      CRUD.update('user', id, formData).then(function(response) {
        // update vm
      }, handleError);
    };

    // destroy user in vm and db
    vm.destroy = function(id) {
      console.info('user:vm.destroy');
      CRUD.destroy('user', id).then(function(response) {
        // update vm
      }, handleError);
    };

    vm.read();

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

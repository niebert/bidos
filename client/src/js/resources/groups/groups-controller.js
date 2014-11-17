/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../../common/crud-service');

  angular.module('bidos.resources.groups.controller', ['bidos.crud-service'])

  .controller('groupCtrl', ['CRUD', '$state', function(CRUD, $state) {

    var vm = this;
    vm.groups = {};

    // post form data
    vm.create = function(formData) {
      console.info('CRUD.create', formData);
      CRUD.create('group', formData).then(function(response) {
        _.merge(vm.groups, response.data);
      }, handleError);
    };

    // get 1 or * groups
    vm.read = function(id) {
      console.info('group:vm.read');
      CRUD.read('group', id).then(function(response) {
        _.merge(vm.groups, response.data);
      }, handleError);
    };

    // post form data
    vm.update = function(id, formData) {
      console.info('group:vm.update');
      CRUD.update('group', id, formData).then(function(response) {
        // update vm
      }, handleError);
    };

    // destroy group in vm and db
    vm.destroy = function(id) {
      console.info('group:vm.destroy');
      CRUD.destroy('group', id).then(function(response) {
        // update vm
      }, handleError);
    };

    vm.read();

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

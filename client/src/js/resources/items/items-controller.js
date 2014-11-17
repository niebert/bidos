/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../../common/crud-service');

  angular.module('bidos.resources.items.controller', ['bidos.crud-service'])

  .controller('itemCtrl', ['CRUD', '$state', function(CRUD, $state) {

    var vm = this;
    vm.items = {};

    // post form data
    vm.create = function(formData) {
      console.info('CRUD.create', formData);
      CRUD.create('item', formData).then(function(response) {
        _.merge(vm.items, response.data);
      }, handleError);
    };

    // get 1 or * items
    vm.read = function(id) {
      console.info('item:vm.read');
      CRUD.read('item', id).then(function(response) {
        _.merge(vm.items, response.data);
      }, handleError);
    };

    // post form data
    vm.update = function(id, formData) {
      console.info('item:vm.update');
      CRUD.update('item', id, formData).then(function(response) {
        // update vm
      }, handleError);
    };

    // destroy item in vm and db
    vm.destroy = function(id) {
      console.info('item:vm.destroy');
      CRUD.destroy('item', id).then(function(response) {
        // update vm
      }, handleError);
    };

    vm.read();

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

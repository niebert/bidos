/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../../common/crud-service');

  angular.module('bidos.resources.kids.controller', ['bidos.crud-service'])

  .controller('kidCtrl', ['CRUD', '$state', function(CRUD, $state) {

    var vm = this;
    vm.kids = {};

    // post form data
    vm.create = function(formData) {
      console.info('CRUD.create', formData);
      CRUD.create('kid', formData).then(function(response) {
        _.merge(vm.kids, response.data);
      }, handleError);
    };

    // get 1 or * kids
    vm.read = function(id) {
      console.info('kid:vm.read');
      CRUD.read('kid', id).then(function(response) {
        _.merge(vm.kids, response.data);
      }, handleError);
    };

    // post form data
    vm.update = function(id, formData) {
      console.info('kid:vm.update');
      CRUD.update('kid', id, formData).then(function(response) {
        // update vm
      }, handleError);
    };

    // destroy kid in vm and db
    vm.destroy = function(id) {
      console.info('kid:vm.destroy');
      CRUD.destroy('kid', id).then(function(response) {
        // update vm
      }, handleError);
    };

    vm.read();

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('../../common/crud-service');

  angular.module('bidos.resources.surveys.controller', ['bidos.crud-service'])

  .controller('surveyCtrl', ['CRUD', '$state', function(CRUD, $state) {

    var vm = this;
    vm.surveys = {};

    // post form data
    vm.create = function(formData) {
      console.info('CRUD.create', formData);
      CRUD.create('survey', formData).then(function(response) {
        _.merge(vm.surveys, response.data);
      }, handleError);
    };

    // get 1 or * surveys
    vm.read = function(id) {
      console.info('survey:vm.read');
      CRUD.read('survey', id).then(function(response) {
        _.merge(vm.surveys, response.data);
      }, handleError);
    };

    // post form data
    vm.update = function(id, formData) {
      console.info('survey:vm.update');
      CRUD.update('survey', id, formData).then(function(response) {
        // update vm
      }, handleError);
    };

    // destroy survey in vm and db
    vm.destroy = function(id) {
      console.info('survey:vm.destroy');
      CRUD.destroy('survey', id).then(function(response) {
        // update vm
      }, handleError);
    };

    vm.read();

    function handleError(response) {
      console.warn('Error: ' + response.data);
    }

  }]);
}());

/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('./resource-constants');
  require('./resource-services');

  angular.module('bidos.resource.controller', [
    'bidos.resource.constants',
    'bidos.resource.services'
  ])

  .controller('resourceCtrl', resourceCtrl);

  function resourceCtrl($scope, $rootScope, resourceService, $state, RESOURCE_ACCESS) {

  var vm = this;
  vm.resources = {};

  // post form data
  vm.create = function(resource, formData) {
    console.info(resource + ':vm.read', formData);
    resourceService.create(resource, formData).then(function(response) {
      _.merge(vm.resources, response);
    }, handleError);
  };

  // get 1 or * (id is optional)
  vm.read = function(resource, id) {
    console.info(resource + ':vm.read');
    resourceService.read(resource, id).then(function(response) {
      _.merge(vm.resources, response);
      console.log(vm.resources);
    }, handleError);
  };

  // post form data
  vm.update = function(resource, id, formData) {
    console.info(resource + ':vm.update');
    resourceService.update(resource, id, formData).then(function(response) {
      // update vm
    }, handleError);
  };

  // destroy in vm and db
  vm.destroy = function(resource, id) {
    console.info(resource + ':vm.destroy');
    resourceService.destroy(resource, id).then(function(response) {
      // update vm
    }, handleError);
  };

  // init: get everything we are allowed to get
  vm.read(RESOURCE_ACCESS[$rootScope.user.role].resources);

  function handleError(response) {
    console.warn('Error: ' + response.data);
  }

};

}());

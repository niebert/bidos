/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  angular.module('bidos.resource.group.controller', [
    'bidos.resource.services'])
  .controller('groupCtrl', groupCtrl);

  function groupCtrl($scope, resourceService) {
    var vm = this;

    vm.createGroup = createGroup;

    $scope.newGroup = {
      name: null,
      description: null
    };

    function createGroup(formData) {
      resourceService.create('groups', formData).then(function(response) {
        _.merge(vm.resources, response);
      }, function createGroupFailure(err) {
        console.warn('failed creating group', err);
      });
    }

  }

}());

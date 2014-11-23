/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.item.controllers', ['ngMaterial', 'bidos.resource.services'])
  .controller('itemCtrl', itemCtrl);

  function itemCtrl($scope, $mdDialog, resourceService) {
    $scope.alert = '';

    // set up the item that's edited in the form beforehand, so we have null
    // values and match the amount of expected values of the prepared
    // statement
    $scope.item = { title: null, description: null, custom: {} };

    $scope.showDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'resources/items/views/dialog.html',
        targetEvent: ev,
      })
      .then(function(item) {
        resourceService.create('items', item);

        $scope.itemObject = 'item "' + item.title + '" erstellt';
      }, function() {
        $scope.itemObject = 'abgebrochen';
      });
    };
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

}());

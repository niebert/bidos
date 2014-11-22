/* global angular */

(function() {
  'use strict';

  angular.module('bidos.resource.item.controllers', ['ngMaterial'])
  .controller('itemCtrl', itemCtrl);

  function itemCtrl($scope, $mdDialog) {
    $scope.alert = '';

    $scope.showDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'resources/items/views/dialog.html',
        targetEvent: ev,
      })
      .then(function(answer) {
        // ITEMOBJ___ ! <3
        debugger

        $scope.itemObject = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.itemObject = 'You cancelled the dialog.';
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

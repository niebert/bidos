/* global angular */

(function() {
  'use strict';

  angular.module('dialog', ['ngMaterial'])

  .controller('dialogCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {
    $scope.alert = '';

    $scope.showDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'partials/dialog1.tmpl.html',
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
  }]);

  function DialogController($scope, $mdDialog) {

    debugger
    console.log($mdDialog.clickOutsideToClose);


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

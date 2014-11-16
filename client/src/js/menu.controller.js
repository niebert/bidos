/* global angular */

(function() {
  'use strict';

    angular.module('rw.menu', []).

    controller('menuCtrl', ['$scope', function ($scope) {
      $scope.bla = 'bla';

      this.selectItem = function(e, detail) {
        if (detail.isSelected) {
          var selectedItem = detail.item;
          console.log(detail, selectedItem);
        }
      };

    }]);

}());

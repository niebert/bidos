/* global angular */

// corresponding template in /client/public_html/authorized/layout.html

(function() {
  'use strict';

    angular.module('bidos.menu-controller', []).

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

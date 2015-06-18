/* global angular */
angular.module('bidos')
.controller('ContentController', ContentController);

function ContentController(Resources, $mdDialog, $mdToast, $scope) {

  Resources.get().then(function(data) {
    $scope.me = data.me;
    $scope.items = data.items;
  });

}

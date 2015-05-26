/* global angular */
angular.module('bidos')
  .controller('ToolbarController', ToolbarController);

  function ToolbarController($scope, $rootScope) {
    $scope.me = $rootScope.me;
  }

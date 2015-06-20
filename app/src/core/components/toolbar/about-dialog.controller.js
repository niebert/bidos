/* global angular */
angular.module('bidos')
  .controller('AboutDialog', AboutDialog);

function AboutDialog(Resources, $scope, $mdDialog) {

  $scope.close = function() {
    $mdDialog.cancel();
  };

}

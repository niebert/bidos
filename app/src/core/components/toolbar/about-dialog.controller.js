/* global angular */
angular.module('bidos')
  .controller('AboutDialog', AboutDialog);

function AboutDialog(Resources, $scope, $mdDialog, CONFIG) {

	$scope.version = CONFIG.version();
	
  $scope.close = function() {
    $mdDialog.cancel();
  };

}

/* global angular */
angular.module('bidos')
  .controller('InfoDialog', InfoDialog);

function InfoDialog(Resources, $scope, resource, $mdDialog) {
	$scope.resource = resource;
	console.info('resource info', resource);
	debugger
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

}

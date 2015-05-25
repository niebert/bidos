/* global angular */
angular.module('bidos')
  .controller('InfoDialog', InfoDialog);

function InfoDialog(Resources, $scope, resource, $mdDialog) {
	$scope.resource = resource;
	console.info('resource info', resource);

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

}

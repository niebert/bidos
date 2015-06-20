/* global angular */
angular.module('bidos')
  .controller('AccountDialog', AccountDialog);

function AccountDialog(Resources, $scope, $mdDialog, locals) {

  $scope.me = locals.me;

  $scope.close = function() {
    $mdDialog.cancel();
  };

}

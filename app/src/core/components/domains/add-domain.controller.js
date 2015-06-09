/* global angular */
angular.module('bidos')
.controller('AddDomainDialog', AddDomainDialog);

function AddDomainDialog(Resources, $scope, $mdDialog, $mdToast) {

  $scope.save = function (domain) {
    domain.type = 'domain';
    debugger
    Resources.create(domain).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Bereich erstellt');
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

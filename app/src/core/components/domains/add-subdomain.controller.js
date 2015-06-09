/* global angular */
angular.module('bidos')
.controller('AddSubdomainDialog', AddSubdomainDialog);

function AddSubdomainDialog(Resources, $scope, $mdDialog, $mdToast, locals) {

  $scope.save = function (subdomain) {
    subdomain.type = 'subdomain';
    subdomain.domain_id = locals.domain.id;
    Resources.create(subdomain).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Teilbereich erstellt');
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

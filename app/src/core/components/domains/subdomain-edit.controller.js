/* global _, angular */
angular.module('bidos')
.controller('EditSubdomainDialog', EditSubdomainDialog);

function EditSubdomainDialog(Resources, $scope, $mdDialog, $mdToast, locals) {

  $scope.subdomain = _.clone(locals.subdomain);

  Resources.get().then(function(data) {
    $scope.subdomains = data.subdomains;
  });

  $scope.save = function (subdomain) {
    Resources.update(subdomain).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', subdomain: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.destroy = function (subdomain) {
    Resources.destroy(subdomain).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Teilbereich gelöscht');
    });
  };

  $scope.cancel = function (subdomain) {
    $mdDialog.hide({action: 'view', subdomain: subdomain});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

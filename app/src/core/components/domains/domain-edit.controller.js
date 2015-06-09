/* global _, angular */
angular.module('bidos')
.controller('EditDomainDialog', EditDomainDialog);

function EditDomainDialog(Resources, $scope, $mdDialog, $mdToast, locals) {

  $scope.domain = _.clone(locals.domain);

  Resources.get().then(function(data) {
    $scope.domains = data.domains;
  });

  $scope.save = function (domain) {
    Resources.update(domain).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', domain: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.destroy = function (domain) {
    Resources.destroy(domain).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Bereich gelöscht');
    });
  };

  $scope.cancel = function (domain) {
    $mdDialog.hide({action: 'view', domain: domain});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

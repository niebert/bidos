/* global angular */
angular.module('bidos')
.controller('InstitutionDialogShow', InstitutionDialogShow);

function InstitutionDialogShow(Resources, $scope, $mdDialog, $mdToast, $state, locals) {
  $scope.institution = locals.institution;

  $scope.edit = function (event, institution) {
    $mdDialog.hide({action: 'edit', institution: institution, event: event});
  };

  $scope.destroy = function (institution) {
    Resources.destroy(institution).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Benutzer gelöscht');
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

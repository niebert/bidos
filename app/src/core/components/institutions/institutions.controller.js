/* global _, angular */
angular.module('bidos')
.controller('InstitutionsController', InstitutionsController);

function InstitutionsController(Resources, $mdDialog, $scope) {

  updateInstitutions();

  $scope.showInstitution = function (ev, institution) {
    $mdDialog.show({
      bindToController: false,
      controller: 'InstitutionDialogShow',
      locals: {
        institution: institution
      },
      targetEvent: ev,
      templateUrl: `templates/institution-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.institutions.splice(_.findIndex($scope.institutions, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editInstitution(response.event, response.institution);
          break;
      }
    });
  };

  $scope.editInstitution = function (ev, institution) {
    $mdDialog.show({
      bindToController: false,
      controller: 'InstitutionDialogEdit',
      locals: {
        institution: institution
      },
      targetEvent: ev,
      templateUrl: `templates/institution-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateInstitutions();
      $scope.showInstitution(null, response.institution);
    });
  };

  function updateInstitutions () {
    Resources.get().then(function(data) {
      $scope.institutions = data.institutions;
    });
  }

}

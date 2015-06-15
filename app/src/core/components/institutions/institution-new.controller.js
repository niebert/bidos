/* global _, angular */
angular.module('bidos')
.controller('AddNewInstitutionDialogController', AddNewInstitutionDialogController);

function AddNewInstitutionDialogController(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.institution = _.clone(locals.institution);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
    $scope.me = data.me;
  });

  $scope.save = function (institution) {
    institution.type = 'institution';
    institution.author_id = $scope.me.id;

    Resources.create(institution).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', institution: response});
      toast('Institution erstellt');
    });
  };

  $scope.cancel = function (institution) {
    $mdDialog.hide({action: 'view', institution: institution});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

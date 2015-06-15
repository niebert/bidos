/* global _, angular */
angular.module('bidos')
.controller('InstitutionDialogEdit', InstitutionDialogEdit);

function InstitutionDialogEdit(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.institution = _.clone(locals.institution);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
  });

  $scope.save = function (institution) {
    Resources.update(institution).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', institution: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.destroy = function (institution) {
    Resources.destroy(institution).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Einrichtung gelöscht');
    }, function(err) {
      if (err[0].hasOwnProperty('content') && err[0].content.detail.match(institution.name) && err[0].content.detail.match('already exists')) {
        toast('Eine Einrichtung mit diesem Namen existiert bereits');
      } else {
        toast('Die Einrichtung konnte nicht gelöscht werden');
      }
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

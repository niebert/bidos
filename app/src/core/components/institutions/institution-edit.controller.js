/* global _, angular */
angular.module('bidos')
.controller('EditInstitution', EditInstitution);

function EditInstitution(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

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
    Resources.destroy(institution).then(function (destroyedInstitution) {
      console.log(destroyedInstitution);
      $mdDialog.hide({action: 'destroy', institution: destroyedInstitution});
      toast('Einrichtung gelöscht');
    }, function (err) {
      if (err.detail.match('still referenced')) {
        toast('Die Einrichtung kann nicht gelöscht werden');
      }
    });
  };

  $scope.cancel = function (institution) {
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

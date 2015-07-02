/* global angular */
angular.module('bidos')
.controller('NewInstitution', NewInstitution);

function NewInstitution(Resources, $scope, $mdDialog, $mdToast) {

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
  });

  $scope.save = function (institution) {
    institution.type = 'institution';
    institution.author_id = $scope.me.id;

    Resources.create(institution)
    .then(function (newInstitution) {
      $mdDialog.hide(newInstitution);
      toast('Einrichtung erstellt');
    }, function(err) {
      if (err[0].hasOwnProperty('content') && err[0].content.detail.match(institution.name) && err[0].content.detail.match('already exists')) {
        toast('Eine Einrichtung mit diesem Namen existiert bereits');
      }
    });
  };

  $scope.cancel = function () {
    $mdDialog.hide();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

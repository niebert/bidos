/* global angular */
angular.module('bidos')
  .controller('KidDialogController', KidDialogController);

function KidDialogController($scope, $rootScope, $mdDialog, $mdToast, $state, UserFactory, STRINGS, Resources, CRUD, resource) {

  $scope.kid = resource;

  $scope.sexes = STRINGS.sexes;
  $scope.me = $rootScope.me;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.destroy = function(kid) {
    kid.type = 'kid';
    if (!confirm('Sind sie sicher?')) return;
    CRUD.destroy(kid).then(function(response) {
      toast('Kind gelöscht');
      $mdDialog.hide({
        resource: response,
        action: 'destroy'
      });
    }, function(err) {
      console.error(err);
    });
  };

  $scope.save = function(kid) {
    kid.type = 'kid';
    kid.author_id = $rootScope.me.id;
    kid.group_id = $rootScope.me.group_id;

    CRUD.create(kid).then(function(response) {
      toast('Kind erstellt');
      console.log(response);
      $mdDialog.hide({
        resource: response,
        action: 'save'
      });
    });
  };

  $scope.edit = function(ev, kid) {
    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        kid: kid
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog-edit.html`
    }).then(function(data) {
      console.log('dialog succeeded', data);
    }, function() {
      console.log('dialog cancelled');
    });
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

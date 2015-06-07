/* global angular */
angular.module('bidos')
  .controller('KidDialogController', KidDialogController);

function KidDialogController($scope, $rootScope, $mdDialog, $mdToast, $state, UserFactory, STRINGS, Resources, CRUD, resource) {

  $scope.kid = resource;
  $scope.me = $rootScope.me;
  $scope.sexes = STRINGS.sexes;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.destroy = function(kid) {
    kid.type = 'kid';

    if (!confirm('Sind sie sicher?')) return;

    Resources.destroy(kid).then(function() {
      toast('Kind gelöscht');
      $mdDialog.hide();
    });
  };

  $scope.save = function(kid) {
    kid.type = 'kid';
    kid.author_id = $rootScope.me.id;
    kid.group_id = $rootScope.me.group_id;

    Resources.create(kid).then(function() {
      toast('Kind erstellt');
      $mdDialog.hide();
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

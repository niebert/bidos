/* global _, angular */
angular.module('bidos')
  .controller('KidDialogController', KidDialogController);

function KidDialogController($scope, $rootScope, $mdDialog, $mdToast, $state, UserFactory, STRINGS, Resources, CRUD, locals) {

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
    $scope.me = data.me;
  });

  $scope.kid = _.clone(locals.kid);
  $scope.kid.bday = $scope.kid.bday ? new Date($scope.kid.bday) : null;

  $scope.localKid = locals.kid;

  $scope.close = function() {
    $mdDialog.cancel();
  };

  $scope.destroy = function (kid) {
    if (!confirm('Sind sie sicher?')) return;
    Resources.destroy(kid).then(function (destroyedKid) {
      $mdDialog.hide({action: 'destroy', kid: destroyedKid});
      toast('Kind gelöscht');
    }, function (err) {
      if (err.detail.match('still referenced')) {
        toast('Das Kind kann nicht gelöscht werden');
      }
    });
  };

  $scope.update = function(kid) {
    if (kid.hasOwnProperty('color')) delete kid.color;
    Resources.update(kid).then(function(updatedKid) {
      $mdDialog.hide({action: 'update', kid: updatedKid});
    });
  };

  $scope.save = function(kid) {
    kid.type = 'kid';
    kid.author_id = $scope.me.id;
    kid.group_id = $scope.me.group_id;

    Resources.create(kid).then(function(newKid) {
      toast('Kind erstellt');
      $mdDialog.hide(newKid);
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

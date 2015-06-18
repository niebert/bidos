/* global _, angular */
angular.module('bidos')
  .controller('KidsController', KidsController);

function KidsController(Resources, $mdDialog, $scope) {

  updateScope();

  $scope.KidDialog = function (ev, kid) {
    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        kid: kid
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog.html`
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          $scope.kids.splice(_.findIndex($scope.kids, {id: response.kid.id}), 1, response.kid);
          break;
        case 'destroy':
          $scope.kids.splice(_.findIndex($scope.kids, {id: response.kid.id}), 1);
          break;
      }
    });
  };

  $scope.NewKidDialog = function (ev) {
    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        kid: {
          type: 'kid',
          author_id: $scope.me.id,
          group_id: $scope.me.group_id
        }
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog-new.html`
    }).then(function(newKid) {
      $scope.kids.push(newKid);
    });
  };

  function updateScope () {
    Resources.get().then(function(data) {
      $scope.users = _.filter(data.users, function(d) { return d.id !== 1; });
      $scope.groups = data.groups;
      $scope.institutions = data.institutions;
      $scope.me = data.me;
      $scope.kids = _.filter(data.kids, {group_id: $scope.me.group_id});
    });
  }

}

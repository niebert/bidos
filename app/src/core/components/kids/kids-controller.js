/* global angular */
angular.module('bidos')
  .controller('KidsController', KidsController);

function KidsController(Resources, $mdDialog, $scope, $rootScope) {

  $scope.KidDialog = function (ev, resource) {
    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog.html`
    });
  };

  $scope.NewKidDialog = function (ev) {
    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        resource: {
          type: 'kid',
          author_id: $rootScope.me.id,
          group_id: $rootScope.me.group_id
        }
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog-new.html`
    });
  };

}

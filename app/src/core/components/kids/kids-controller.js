/* global _, angular */
angular.module('bidos')
  .controller('KidsController', KidsController);

function KidsController(Resources, $mdDialog, $scope, $rootScope) {

  function updateViewModel() {
    Resources.get()
    .then(function(data) {

      $scope.kids = data.kids.filter(function(kid) {
        if (!kid) return false;
        return kid.group_id === ($rootScope.me.group_id ? $rootScope.me.group_id : kid.group_id); // admin sees all kids
      });

    });
  }

  updateViewModel();

  $scope.KidDialog = function (ev, resource) {
    console.log('dialog resource', resource);

    $mdDialog.show({
      bindToController: false,
      controller: 'KidDialogController',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/kid-dialog.html`
    }).then(function(response) {

      console.log('dialog succeeded', response);

      if (response.action === 'destroy') {
        $scope.kids.splice(_.findIndex($scope.kids, {id: response.resource[0].id}), 1);
        console.log('kid removed from scope');
      }

    }, function() {
      console.log('dialog cancelled');
    });
  };

  $scope.NewKidDialog = function (ev) {
    console.log('aaa');
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
    }).then(function(response) {

      console.log('dialog succeeded', response);

      if (response.action === 'save') {
        $scope.kids.push(response.resource[0]);
        console.log('kid added to scope');
      }

    }, function() {
      console.log('dialog cancelled');
    });
  };

}

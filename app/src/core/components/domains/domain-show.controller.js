/* global angular */
angular.module('bidos')
.controller('ItemDialogShow', ItemDialogShow);

function ItemDialogShow(Resources, $scope, $mdDialog, $mdToast, $state, locals) {
  $scope.item = locals.item;

  $scope.edit = function (event, item) {
    $mdDialog.hide({action: 'edit', item: item, event: event});
  };

  $scope.destroy = function (item) {
    Resources.destroy(item).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Benutzer gelöscht');
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

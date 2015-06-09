/* global _, angular */
angular.module('bidos')
.controller('ItemDialogEdit', ItemDialogEdit);

function ItemDialogEdit(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.item = _.clone(locals.item);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.items = data.items;
  });

  $scope.save = function (item) {
    Resources.update(item).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', item: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.cancel = function (item) {
    $mdDialog.hide({action: 'view', item: item});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}

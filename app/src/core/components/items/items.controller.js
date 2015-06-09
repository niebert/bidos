/* global _, angular */
angular.module('bidos')
.controller('ItemsController', ItemsController);

function ItemsController(Resources, $mdDialog, $scope) {

  updateItems();

  $scope.showItem = function (ev, item) {
    $mdDialog.show({
      bindToController: false,
      controller: 'ItemDialogShow',
      locals: {
        item: item
      },
      targetEvent: ev,
      templateUrl: `templates/item-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.items.splice(_.findIndex($scope.items, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editItem(response.event, response.item);
          break;
      }
    });
  };

  $scope.editItem = function (ev, item) {
    $mdDialog.show({
      bindToController: false,
      controller: 'ItemDialogEdit',
      locals: {
        item: item
      },
      targetEvent: ev,
      templateUrl: `templates/item-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateItems();
      $scope.showItem(null, response.item);
    });
  };

  function updateItems () {
    Resources.get().then(function(data) {
      $scope.items = data.items;
      debugger
    });
  }

}

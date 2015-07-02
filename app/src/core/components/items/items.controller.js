/* global _, angular */
angular.module('bidos')
.controller('Items', Items);

function Items(Resources, $mdDialog, $scope) {

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
          // $scope.editItem(response.event, response.item);
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
      // $scope.showItem(null, response.item);
    });
  };

  function updateItems () {
    Resources.get().then(function(data) {
      $scope.items = data.items;
      $scope.domains = data.domains;
    });
  }

  $scope.stuff = {};

  $scope.resetFilters = function() {
    $scope.stuff = {};
  };

  $scope.myFilter = function(item) {
    let q = [];

    if ($scope.stuff.domain_id) {
      q.push(compareNum($scope.stuff.domain_id, item.subdomain.domain.id));
    }

    return _.all(q);

    function compareNum(a, b) {
      if (a && b) {
        return parseInt(a) === parseInt(b);
      }
      return true;
    }

    function compareString(a, b) {
      if (a && b) {
        return b.match(new RegExp(a, 'gi'));
      }
      return true;
    }
  };

  $scope.addItem = function (ev, subdomain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'AddItemDialog',
      locals: {
        subdomain: subdomain
      },
      targetEvent: ev,
      templateUrl: `templates/add-item.dialog.html`
    }).then(function(response) {
      if (!response) return;
      updateItems();
      // $scope.showItem(null, response.item);
    });
  };

}

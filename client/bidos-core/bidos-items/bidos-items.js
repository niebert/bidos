(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosItems', bidosItems);

  function bidosItems() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-items/bidos-items.html'
    };

    function controllerFn(ResourceService, $mdDialog) {
      var vm = angular.extend(this, {
        data: {},
        createOrEditItemDialog: createOrEditItemDialog
      });


      ResourceService.get().then(function(data) {
        angular.extend(vm.data, data);
      });


      function createOrEditItemDialog(ev, item) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogControllerFn,
            controllerAs: 'vmd',
            locals: {
              item: item,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-items/bidos-items.dialog.html'
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogControllerFn($mdDialog, data, item) {
        var vmd = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          item: item,
          getDomainTitle: getDomainTitle,
        });

        // vm.new.item = new Item(); // XXX TODO XXX HERE HERE HERE

        function getDomainTitle(subdomain_id) {
          return _.select(vm.data.domains, {
            id: subdomain_id
          })[0].title;
        }


        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(id) {
          ResourceService.destroy('item', id).then(function(response) {
            $mdDialog.hide(response);
          });
        }

        function save(item) {
          if (item.id) {
            ResourceService.update('item', item).then(function(response) {
              console.log('resource updated:', item);
              $mdDialog.hide(response);
            });
          } else {
            ResourceService.create('item', item).then(function(response) {
              console.log('resource created:', item);
              $mdDialog.hide(response);
            });
          }
        }
      }
    }
  }

}());

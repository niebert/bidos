(function() {
  'use strict';
  /* global angular, faker */

  angular.module('bidos')
    .directive('bidosSubdomains', bidosSubdomains);

  function bidosSubdomains() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/resources/directives/bidos-subdomains/bidos-subdomains.list.html'
    };

    function controllerFn(ResourceService, $mdDialog) {
      var vm = angular.extend(this, {
        data: {},
        createOrEditSubdomainDialog: createOrEditSubdomainDialog
      });


      ResourceService.get().then(function(data) {
        angular.extend(vm.data, data);
      });


      function createOrEditSubdomainDialog(ev, subdomain) {
        $mdDialog.show({
            bindToController: false,
            controller: CreateOrEditSubdomainController,
            controllerAs: 'vmd',
            locals: {
              subdomain: subdomain,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/resources/directives/bidos-subdomains/bidos-subdomains.dialog.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function CreateOrEditSubdomainController($mdDialog, data, subdomain) {
        console.log('CreateOrEditSubdomainController', subdomain);
        var vmd = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          subdomain: subdomain
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(id) {
          ResourceService.destroy('subdomain', id).then(function(response) {
            $mdDialog.hide(response);
          });
        }

        function save(subdomain) {
          if (subdomain.id) {
            ResourceService.update('subdomain', subdomain).then(function(response) {
              console.log('resource updated:', subdomain);
              $mdDialog.hide(response);
            });
          } else {
            ResourceService.create('subdomain', subdomain).then(function(response) {
              console.log('resource created:', subdomain);
              $mdDialog.hide(response);
            });
          }
        }
      }
    }
  }

}());

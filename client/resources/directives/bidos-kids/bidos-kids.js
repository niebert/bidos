(function() {
  'use strict';
  /* global angular, faker */

  // Fri Dec 26 20:30:35 CET 2014

  angular.module('bidos')
    .directive('bidosKids', bidosKids);

  faker.locale = 'de';

  function bidosKids() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/resources/directives/bidos-kids/bidos-kids.html'
    };

    function controllerFn(resourceService, $mdDialog) {
      var vm = angular.extend(this, {
        data: {},
        createOrEditKidDialog: createOrEditKidDialog,
        createRandomKid: createRandomKid
      });


      resourceService.get().then(function(data) {
        angular.extend(vm.data, data);
      });


      function createOrEditKidDialog(ev, kid) {
        $mdDialog.show({
            bindToController: false,
            controller: CreateOrEditKidController,
            controllerAs: 'vmd',
            locals: {
              kid: kid,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/resources/directives/bidos-kids/createOrEditKidDialog.tmpl.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function CreateOrEditKidController($mdDialog, data, kid) {
        console.log('CreateOrEditKidController', kid);
        var vmd = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          kid: kid
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(id) {
          resourceService.destroy('kid', id).then(function(response) {
            $mdDialog.hide(response);
          });
        }

        function save(kid) {
          if (kid.id) {
            resourceService.update('kid', kid).then(function(response) {
              console.log('resource updated:', kid);
              $mdDialog.hide(response);
            });
          } else {
            resourceService.create('kid', kid).then(function(response) {
              console.log('resource created:', kid);
              $mdDialog.hide(response);
            });
          }
        }
      }


      function createRandomKid() {
        resourceService.create('kid', {
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          age: faker.random.number({
            min: 6,
            max: 12
          }),
          sex: faker.random.number({
            min: 1,
            max: 2
          }),
          group_id: faker.random.number({
            min: 1,
            max: 4
          })
        });
      }
    }
  }

}());

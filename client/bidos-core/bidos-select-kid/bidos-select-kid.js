(function() {
  'use strict';
  /* global angular, faker */

  // Fri Dec 26 20:30:35 CET 2014

  angular.module('bidos')
    .directive('bidosSelectKid', bidosSelectKid);

  faker.locale = 'de';

  function bidosSelectKid() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-select-kid/bidos-select-kid.html'
    };

    function controller(ResourceService, $mdDialog, $rootScope, $state, CaptureService) {
      var vm = angular.extend(this, {
        dialogControllerFn: dialogControllerFn,
        selectKid: selectKid
      });



      ResourceService.get().then(function(data) {
        vm.kids = data.kids;
        vm.groups = data.groups;
      });



      function selectKid(kid) {
        console.log(kid);
        // $rootScope.selectedKid = kid;
        CaptureService.selectKid(kid);
        $state.go('auth.capture');
      }


      function dialogControllerFn(ev, kid) {
        $mdDialog.show({
            bindToController: false,
            controller: CreateOrEditKidController,
            controllerAs: 'vmd',
            locals: {
              kid: kid,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-kids/bidos-selectKid.dialog.html'
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
          ResourceService.destroy('kid', id).then(function(response) {
            $mdDialog.hide(response);
          });
        }

        function save(kid) {
          if (kid.id) {
            ResourceService.update('kid', kid).then(function(response) {
              console.log('resource updated:', kid);
              $mdDialog.hide(response);
            });
          } else {
            ResourceService.create('kid', kid).then(function(response) {
              console.log('resource created:', kid);
              $mdDialog.hide(response);
            });
          }
        }
      }


      function createRandomKid() {
        ResourceService.create('kid', {
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

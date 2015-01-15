(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosObserve', bidosObserve);


  function bidosObserve() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-observe/bidos-observe.html'
    };

    function controllerFn(ResourceService, $state, CaptureService, $mdDialog) {
      var vm = angular.extend(this, {
        behaviour: behaviour,
        examples: examples,
        dialog: dialog
      });

      ResourceService.get()
        .then(function(data) {
          vm.data = data;
        });

      CaptureService.getCurrent()
        .then(function(observation) {
          vm.observation = observation;

          // fallback to select-domain if no domain is selected
          if (!observation.kid || !observation.item) {
            $state.go('auth.capture');
          }

        });

      function behaviour(niveau) {
        var a = _.select(vm.data.behaviours, {
          item_id: vm.observation.item.id,
          niveau: niveau
        });

        if (a.length && a[0].hasOwnProperty('description')) {
          return a[0].description;
        } else {
          return 'KEIN VERHALTEN GEFUNDEN! BEARBEITEN SIE DEN BAUSTEIN!';
        }
      }

      function examples(niveau) {

        var behaviour = _.select(vm.data.behaviours, {
          item_id: vm.observation.item.id,
          niveau: niveau
        });

        if (!behaviour.length) {
          return;
        }

        var e = _.select(vm.data.examples, {
          behaviour_id: behaviour.id,
        });

        if (!e.length) {
          return ['KEINE BEISPIELE GEFUNDEN'];
        } else {
          return e;
        }

      }

      function dialog(ev, kid) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              kid: kid,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-observe/bidos-observe.dialog.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogController($mdDialog) {
        angular.extend(this, {
          cancel: cancel,
          save: save
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function save(kid) {
          ResourceService.create('kid', kid)
            .then(function(response) {
              console.log('resource created:', kid);
              $mdDialog.hide(response);
            });
        }
      }
    }
  }

}());

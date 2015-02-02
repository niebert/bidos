(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosCapture', bidosCapture);

  function bidosCapture() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: function(elem, attrs) {
        console.log('%cCAPTURE CONTROLLER : ' + (attrs.type || '_'), 'color: #333; font-weight: 500; font-size: 1.2em;');
        if (attrs.type) {
          return 'bidos-core/bidos-capture/_templates/bidos-capture-' + attrs.type + '.html';
        } else {
          return 'bidos-core/bidos-capture/_templates/bidos-capture.html';
        }
      }
    };

    function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, CaptureService, ResourceService, STRINGS) {

      var vm = angular.extend(this, {
        add: add,
        remove: remove,
        debug: debug,
        reset: reset,
        select: select,
        go: go,

        isActive: isActive,
        isDisabled: isDisabled,
        indexChar: indexChar,

        nextExample: nextExample,

        kidFilter: kidFilter,
        maxSkill: maxSkill,
      });

      // should happen only once
      updateViewModel();

      function debug() {
        console.log(vm.observation);
      }

      function add(resource) {
        CaptureService.add(resource)
          .then(function(observation) {
            vm.observation = observation;
            delete $scope.newStuff;
          });
      }

      function remove(resource) {
        CaptureService.remove(resource)
          .then(function(observation) {
            vm.observation = observation;
          });
      }

      function reset() {
        CaptureService.reset(resource)
          .then(function(observation) {
            vm.observation = observation;
          });
      }

      function select(resource) {
        CaptureService.select(resource);
      }

      function go(type) {
        CaptureService.go({type:type}); // or at least { type:'whatever' }
      }

      function updateViewModel() {
        angular.extend(vm, STRINGS);

        ResourceService.get()
          .then(function(data) {
            angular.extend(vm, data);
          });

        CaptureService.get()
          .then(function(observation) {
            vm.observation = observation;
          });
      }

      function isActive(type) {
        return $state.params.type === type ? 'is-active' : '';
      }

      function isDisabled(type) {
        return !vm.observation.hasOwnProperty(type) && !this.isActive(type);
      }

      function indexChar(index) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index];
      }


      function kidFilter(filterObject) {
        if (!filterObject) {
          return;
        }

        return function(kid) {
          var a = [];

          if (filterObject.hasOwnProperty('name') && filterObject.name !== null) {
            var re = new RegExp(filterObject.name, 'gi');
            a.push(kid.name.match(re));
          }

          if (filterObject.hasOwnProperty('sex') && filterObject.sex !== null) {
            a.push(kid.sex === filterObject.sex);
          }
          console.log(filterObject, _.all(a));
          return _.all(a);
        };
      }

      function maxSkill() {
        return _.reduce(vm.observations, function(a, b) {
          return a + b.niveau;
        });
      }

      function nextExample(behaviour) {
        if (!behaviour.hasOwnProperty('exId')) {
          behaviour.exId = 1;
        } else {
          if (behaviour.exId < behaviour.examples.length - 1) {
            behaviour.exId += 1;
          } else {
            behaviour.exId = 0;
          }
        }
      }

    }
  }

}());

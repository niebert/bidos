(function() {
  'use strict';
  /* global angular */

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

    function controllerFn($state, CaptureService, ResourceService, $mdDialog, $scope, $rootScope, $stateParams, STRINGS) {

      var vm = angular.extend(this, {
        go: go,
        add: add,
        select: select,
        isActive: isActive,
        isDisabled: isDisabled,
        nextExample: nextExample,
        kidFilter: kidFilter,
        maxSkill: maxSkill,
        getChar: getChar,
        debug: debug
      });

      init();

      function debug() {
        console.log(vm.observation);
      }

      // should happen only once

      function go(type) {
        CaptureService.go(type);
      }

      function init() {
        CaptureService.get()
          .then(function(observation) {
            vm.observation = observation;

            _.each(vm.observation.order, function(d) {
              if ($state.params.type === 'd') {
                return;
              }
              if (!vm.observation.hasOwnProperty(d)) {
                debugger
                go(d);
                return;
              }
            });

            ResourceService.get()
              .then(function(data) {
                updateViewModel(data);
              });
          });
      }

      function add(resource) {
        CaptureService.add(resource)
          .then(function(observation) {
            vm.observation = observation;
          });
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

      function getChar(index) {
        switch (index) {
          case 0:
            return 'A';
          case 1:
            return 'B';
          case 2:
            return 'C';
          case 3:
            return 'D';
        }
      }

      function select(resource) {
        CaptureService.select(resource);
      }

      function updateViewModel(data) {
        angular.extend(vm, data);
        angular.extend(vm, STRINGS);
      }

      function isActive(type) {
        return $state.params.type === type;
      }

      function isDisabled(type) {
        if (vm.observation.hasOwnProperty(type)) {
          return false;
        }

        if (!this.isActive(type)) {
          return true;
        }
      }

    }
  }

}());

(function() {
  'use strict';
  /* global angular, _ */

  var steps = require('../../config')
    .steps;

  angular.module('bidos')
    .directive('bidosCapture', bidosCapture);

  function bidosCapture() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: controllerFn,
      templateUrl: templateFn,
      link: linkFn
    };

    function templateFn(elem, attr) {
      if (attr.type) {
        return 'bidos-core/bidos-capture/_templates/bidos-capture-' + attr.type + '.html';
      } else {
        return 'bidos-core/bidos-capture/_templates/bidos-capture.html';
      }
    }

    function linkFn(scope, elem, attr) {
      if (attr.type) {
        console.log('%c\nCAPTURE CONTROLLER : ' + (attr.type || '_'), 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        scope.vm.go(attr.type);
      } else {
        console.log('%c\nCAPTURE CONTROLLER : ' + (attr.type || '_'), 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        scope.vm.start();
      }
    }

    function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, CaptureService, ResourceService, STRINGS) {

      var vm = angular.extend(this, {
        add: add,
        remove: remove,
        debug: debug,
        select: select,
        next: next,
        go: go,
        start: start,
        done: done,

        isActive: isActive,
        isDisabled: isDisabled,
        indexChar: indexChar,

        nextExample: nextExample,

        kidFilter: kidFilter,
        maxSkill: maxSkill,
      });

      // should happen only once
      updateViewModel();

      function done() {
        CaptureService.done();
      }

      function next() {
        CaptureService.next();
      }

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

      function start() {
        CaptureService.start();
      }

      function remove(resource) {
        CaptureService.remove(resource);
      }

      function select(resource) {
        CaptureService.select(resource);
      }

      function go(type) {
        CaptureService.go({
          type: type
        });
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
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' [index];
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

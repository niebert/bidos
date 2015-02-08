(function() {
  'use strict';
  /* jshint esnext:true */
  /* global angular, _, document */

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
        console.log('%c\nCAPTURE CONTROLLER : ' + attr.type, 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        scope.vm.go(attr.type);
      } else {
        console.log('%c\nCAPTURE CONTROLLER : _', 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        if (scope.vm.observation) {
          console.warn('DOES THIS EVER HAPPEN?');
          console.log('deleting existing observation');
          delete scope.vm.observation;
        } else {
          console.log('no existing observation');
        }
        scope.vm.reset();
      }

      // count watchers
      (function() {
        var root = angular.element(document.getElementsByTagName('html'));

        var watchers = [];

        var f = function(element) {
          angular.forEach(['$scope', '$isolateScope'], function(scopeProperty) {
            if (element.data() && element.data()
              .hasOwnProperty(scopeProperty)) {
              angular.forEach(element.data()[scopeProperty].$$watchers, function(watcher) {
                watchers.push(watcher);
              });
            }
          });

          angular.forEach(element.children(), function(childElement) {
            f(angular.element(childElement));
          });
        };

        f(root);

        // Remove duplicate watchers
        var watchersWithoutDuplicates = [];
        angular.forEach(watchers, function(item) {
          if (watchersWithoutDuplicates.indexOf(item) < 0) {
            watchersWithoutDuplicates.push(item);
          }
        });

        console.debug('watchers:', watchersWithoutDuplicates.length);
      })();
    }

    function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, CaptureService, ResourceService, STRINGS) {

      var vm = angular.extend(this, {
        add: add,
        remove: remove,
        select: select,
        go: go,
        reset: reset,
        start: start,
        isActive: isActive,
        isDisabled: isDisabled,
        indexChar: indexChar,

        nextExample: nextExample,

        kidFilter: kidFilter,
        maxSkill: maxSkill,
      });

      // should happen only once
      updateViewModel();

      function add(resource) {
        CaptureService.add(resource);
        delete $scope.newStuff;
      }

      // reset and start over
      function reset() {
        CaptureService.reset();
      }

      function start() {
        CaptureService.reset();
        CaptureService.select({
          type: 'start',
          value: new Date()
        });
      }

      function remove() {
        CaptureService.remove();
      }

      function go(type) {
        CaptureService.go(type);
      }

      function select(resource) {
        CaptureService.select(resource);
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
        if (vm.hasOwnProperty('observation')) {
          return vm.observation.steps.indexOf(type) >= vm.observation.steps.indexOf($state.params.type);
        }
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
          // console.slog(filterObject, _.all(a));
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

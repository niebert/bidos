(function() {
  'use strict';
  /* jshint esnext:true */
  /* global angular, _, document */

  angular.module('bidos')
    .directive('bxCapture', bxCapture);

  var bxConfig = require('../../../config');

  function bxCapture() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: controllerFn,
      templateUrl: templateFn,
      link: linkFn
    };

    function templateFn(elem, attr) {
      console.log('template', attr.type);
      console.log('attr.type', attr.type);
      if (attr.type) {
        return 'core/lib/bx-capture/bx-capture-' + attr.type + '.html';
      } else {
        return 'core/lib/bx-capture/bx-capture.html';
      }
    }

    function linkFn(scope, elem, attr) {
      if (attr.type) {
        console.log('%c\nCAPTURE CONTROLLER : ' + attr.type, 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        scope.vm.go(attr.type);
      } else {
        console.log('%c\nCAPTURE CONTROLLER : _', 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        // if (scope.$rootScope.observation) {
        //   console.warn('DOES THIS EVER HAPPEN?');
        //   console.log('deleting existing observation');
        //   delete scope.$rootScope.observation;
        // } else {
        //   console.log('no existing observation');
        // }
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

    function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, $mdToast, $mdSidenav, bxObservation, bxResources) {
      var vm = angular.extend(this, {
        add: add,
        remove: remove,
        select: select,
        go: go,
        reset: reset,
        // start: start,
        isActive: isActive,
        isDisabled: isDisabled,
        indexChar: indexChar,
        observation: $rootScope.observation,
        nextExample: nextExample,
        deleteStuff: deleteStuff,
        kidFilter: kidFilter,
        groupFilter: groupFilter,
        maxSkill: maxSkill,
        toolbarState: $state.params.type,
        save: save,
        rightNav: rightNav
      });

      // var toast = $mdToast.build();

      function rightNav() {
        $mdSidenav('right')
          .toggle()
          .then(function() {
            console.log('toggle RIGHT is done');
          });
      }

      // should happen only once
      updateViewModel();
      console.log($state);

      function save() {
        bxObservation.save();
      }

      function deleteStuff(stuff) {
        _.remove(vm.observation.stuff[stuff.type + 's'], stuff);
      }

      function add(resource) {
        bxObservation.add(resource);
        delete $scope.newStuff;
      }

      // reset and start over
      function reset() {
        bxObservation.reset();
      }

      // function start() {
      //   bxObservation.reset();
      //   this.go('bx.capture', {
      //     type: 'kid',
      //   });

      //   // $mdToast.show(toast.content('Neue Beobachtung'));

      //   $mdToast.show($mdToast.simple()
      //     .content('Neue Beobachtung gestartet')
      //     .position('bottom right')
      //     .hideDelay(7000));
      // }

      function remove() {
        bxObservation.remove();
      }

      function go(type) {
        bxObservation.go(type);
      }

      function select(resource) {
        bxObservation.select(resource);
      }

      function updateViewModel() {
        angular.extend(vm, bxConfig);

        bxResources.get()
          .then(function(data) {
            angular.extend(vm, data); // NOTE the extend
          });

        bxObservation.get()
          .then(function(observation) {
            $rootScope.observation = observation;
          });
      }

      function isActive(type) {
        return $state.params.type === type ? 'is-active' : '';
      }

      function isDisabled(type) {
        if ($rootScope.hasOwnProperty('observation')) {
          return $rootScope.observation.steps.indexOf(type) >= $rootScope.observation.steps.indexOf($state.params.type);
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

          // NOTE: cleared input/select fields set null value to bound variable

          if (filterObject.hasOwnProperty('kidName') && filterObject.kidName !== null) {
            var re = new RegExp('\\b' + filterObject.kidName, 'i'); // leading word delimiter
            a.push(kid.name.match(re));
          }

          if (filterObject.hasOwnProperty('kidId') && filterObject.kidId !== null) {
            a.push(kid.id === filterObject.kidId);
          }

          // 0 == male; 1 == female
          if (filterObject.hasOwnProperty('kidSex') && filterObject.kidSex !== null) {
            a.push(kid.sex === filterObject.kidSex);
          }

          return _.all(a);
        };
      }

      function groupFilter(filterObject) {
        if (!filterObject) {
          return;
        }

        return function(group) {
          var a = []; // wbr

          // NOTE: cleared input/select fields set null value to bound variable

          if (filterObject.hasOwnProperty('groupId') && filterObject.groupId !== null) {
            a.push(group.id === filterObject.groupId);
          }

          var kidLength = _.without(group.kids, {
              id: filterObject.kidId
            })
            .length;

          a.push(kidLength);
          console.log(_.all(a));
          return _.all(a);
        };
      }

      function maxSkill() {
        return _.reduce($rootScope.observations, function(a, b) {
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

(function() {
  'use strict';
  /* jshint esnext:true */
  /* global angular, _, document */

  var APP_CONFIG = require('../../../config');

  angular.module('bidos')
    .directive('bxCapture', bxCapture);

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
        return 'templates/bx-capture-' + attr.type + '.html';
      } else {
        return 'templates/bx-capture.html';
      }
    }

    function linkFn(scope, elem, attr) {
      if (attr.type) {
        console.log('%c\nCAPTURE CONTROLLER : ' + attr.type, 'color: #161616; font-weight: bolder; font-size: 1.5em;');
        scope.vm.go(attr.type);
      } else {
        console.log('%c\nCAPTURE CONTROLLER : _', 'color: #161616; font-weight: bolder; font-size: 1.5em;');
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

    function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, $mdToast, $mdSidenav, Observation, Resources, CONFIG, STRINGS) {
      var vm = angular.extend(this, {
        add: add,
        remove: remove,
        select: select,
        go: go,
        reset: reset,
        isActive: isActive,
        isDisabled: isDisabled,
        indexChar: indexChar,
        observation: $rootScope.observation,
        nextExample: nextExample,
        deleteStuff: deleteStuff,
        kidFilter: kidFilter,
        maxSkill: maxSkill,
        toolbarState: $state.params.type,
        abort: abort,
        save: save,
        rightNav: rightNav
      });

      function abort(ev) {
        var confirm = $mdDialog.confirm()
          .title('Möchten Sie wirklich abbrechen?')
          .content('Ihre Fortschritte werden nicht gespeichert!')
          .ariaLabel('Abort Dialog')
          .ok('Abbrechen')
          .cancel('Nicht Abbrechen')
          .targetEvent(ev);

        $mdDialog.show(confirm)
          .then(function() {
            $scope.alert = 'You decided to get rid of your debt.';
          }, function() {
            $scope.alert = 'You decided to keep your debt.';
          });
      }

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
        Observation.save();
      }

      function deleteStuff(stuff) {
        _.remove(vm.observation.stuff[stuff.type + 's'], stuff);
      }

      function add(resource) {
        Observation.add(resource);
        delete $scope.newStuff;
      }

      // reset and start over
      function reset() {
        Observation.reset();
      }

      function remove() {
        Observation.remove();
      }

      function go(type) {
        Observation.go(type);
      }

      function select(resource) {
        Observation.select(resource);
      }

      function updateViewModel() {
        angular.extend(vm, APP_CONFIG);

        Resources.get()
          .then(function(resources) {
            angular.extend(vm, resources); // NOTE the extend
          });

        Observation.get()
          .then(function(observation) {
            $rootScope.observation = observation;
          });
      }

      function isActive(type) {
        return $state.params.type === type ? 'is-active' : '';
      }

      function isDisabled(type) {
        if ($rootScope.hasOwnProperty('observation')) {
          return STRINGS.steps.indexOf(type) >= STRINGS.steps.indexOf($state.params.type);
        }
      }

      function indexChar(index) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' [index]; // what is this? XXX TODO FIXME
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

      $scope.stuff = {};

      $scope.groupFilter = function(filterObject) {
        if (!filterObject) return;

        // we return a function that returns true if the child matches and
        // false if not
        return function(group) {
          var a = [];

          // NOTE: cleared input/select fields are set to null value to
          // bound variable!                              ^^^^
          if (filterObject.hasOwnProperty('groupId') && filterObject.groupId !== null) {
            a.push(group.id === filterObject.groupId);
          }

          var kidLength = _.without(group.kids, {
            id: filterObject.kidId
          }).length;

          a.push(kidLength);
          console.log('groupFilter', a, _.all(a));
          return _.all(a);
        };
      };

      $scope.myFilter = function() {

        /*
           NOTE TO WHOEVER MAY SEE THIS: Things here may be kind of tricky.

           - argument[0] is any resource object that you want to filter, i.e.
           - a kid or a group

           - hooking things up via $scope is much more easy than going the
           - vm.whatever road. it's much more plug-and-play

          - arguments[0].group.id is possible because of that funny method in
          - our ResourceService. For every resource objects key that ends with
          - '_id', e.g. 'group_id' we add a getter method named 'group'
          - (removing the suffix). That getter method is only called when
          - called, and then resolves the actual resource the _id key is
          - referring to. Iirc some things didn't work out so well (looping
          - and calling these getters via ng-repeat?), but apparently it just
          - works now. May be due to enumerable:false being set in these
          - getters; see MDN on defineProperty/enumerable
          - https://goo.gl/JolS3o
        */

        let q = [];

        if ($scope.stuff.id) {
          q.push(compareNumber($scope.stuff.id, arguments[0].id));
        };

        if ($scope.stuff.name) {
          q.push(compareString($scope.stuff.name, arguments[0].name));
        }

        if ($scope.stuff.title) {
          q.push(compareString($scope.stuff.title, arguments[0].title));
        }

        if ($scope.stuff.group && arguments[0].group) {
          q.push(compareString($scope.stuff.group, (arguments[0].group.name || '')));
        }

        if ($scope.stuff.group_id && arguments[0].group_id) {
          q.push(compareNumber($scope.stuff.group_id, (arguments[0].group.id || '')));
        }

        if ($scope.stuff.institution) {
          q.push(compareString($scope.stuff.institution, arguments[0].institution.name));
        }

        return _.all(q);

        function compareNumber(a, b) {
          if (a && b) {
            return parseInt(a) === parseInt(b);
          }
          return true;
        }

        function compareString(a, b) {
          if (a && b) {
            return b.match(new RegExp(a, 'gi'));
          }
          return true;
        }
      };


      function maxSkill() {
        return _.reduce($rootScope.observations, function(a, b) {
          return a + b.niveau;
        });
      }

      function nextExample(behaviour) { // FIXME
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

/* jshint esnext:true */
/* global angular, _ */

(function() {
  'use strict';

  var steps = require('../../config').steps;

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q, $state) {

    class Observation {
      constructor() {
        this.stuff = {};
        this.author_id = $rootScope.auth.id;
      }

      get satisfaction() {
        var type = $state.params.type;
        var index = steps.indexOf(type);
        var deps = steps.slice(0, index + 1);
        return _.all(deps, type => this.hasOwnProperty(type), this);
      }

      get steps() {
        return steps;
      }

      remove(resource) {
        if (!resource.hasOwnProperty('type')) {
          console.warn('resource has no type');
          return;
        }

        var types = resource.type + 's'; // pluralize

        if (!this.stuff.hasOwnProperty(types)) {
          console.warn('observation has no' + types);
          return;
        }

        var resourceIndex = this.stuff[types].indexOf(resource);

        return this.stuff[types].splice(resourceIndex, 1);
      }
    }

    var o = new Observation();

    return {
      select: select, // set a resource as selected
      get: get, // return observation to controller or whatever
      go: go, // go to resource (go to next w/o arg)
      reset: reset,
      add: add
    };

    function reset() {
      console.log('resetting observation');
      return $q(function(resolve) {
        o = new Observation();
        $state.go('auth.capture.go', {
          type: 'start'
        });
        resolve(o);
      });
    }

    function get() {
      return $q(resolve => resolve(o));
    }


    function add(resource) {
      if (!resource.hasOwnProperty('type')) {
        console.warn('resource has no type');
        return;
      }

      var types = resource.type + 's'; // pluralize

      if (!o.stuff.hasOwnProperty(types)) {
        o.stuff[types] = [];
      }

      // returns length of o.stuff[types]
      return o.stuff[types].push(resource);
    }


    function select(resource) {
      switch (resource.type) {
        case 'example':
        case 'idea':
          o.add(resource);
          break;
        default:
          o[resource.type] = resource;
      }
      go();
    }

    // no arg: go to next step
    function go(resourceType) {
      var i = $state.params.type ? steps.indexOf($state.params.type) : 0;

      o.satisfaction ? i++ : i = 0;

      return $state.go('auth.capture.go', {
        type: resourceType || steps[i]
      });



      // var c = currentStep();
      // var i;

      // console.log('go(' + JSON.stringify(resourceType) + ')');

      // if (o.hasOwnProperty(type)) {
      //   console.log('%c>>', 'color: #ca5f1b; font-weight: bolder; font-size: 1.3em;');
      //   i++; // go to next
      // } else if (steps.indexOf(type) >= i) {
      //   console.log('a');
      //   // must be true for the previous step to not go back
      //   while (!o.hasOwnProperty(steps[i - 1]) && i > 0) {
      //     console.log('b');
      //     console.log('%c<<', 'color: #ca5f1b; font-weight: bolder; font-size: 1.3em;');
      //     i--; // go one step back
      //   }
      // }


      // if (!arguments.length) {

      //   // 1. get current position from $state.params.type
      //   // 2. check if we need to rewind
      //   // 3. go there
      //   // -. dont go anywhere if the current position isnt satisfied

      //   i++;
      //   console.log('current step is', i, steps[i]);

      //   // if i is -1 (not found), go to start
      //   i = i < 0 ? 0 : i;

      // } else {
      //   i = steps.indexOf(resourceType);
      // }

      // console.log('next step is', i, steps[i]);

      // $state.go('auth.capture.go', {
      //   type: steps[i]
      // });
    }

  }
}());

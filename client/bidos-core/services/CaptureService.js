/* global angular, _ */

(function() {
  'use strict';

  var steps = require('../../config')
    .steps;

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q, $state) {

    var observation = {};

    return {
      get: get,
      done: done, // save and reset
      select: select, // a.k.a. next
      add: add,
      next: next,
      go: go, // go to resource
      start: start // reset and go
    };

    function add(resource) {
      return $q(function(resolve) {
        var type = resource.type + 's'; // pluralized
        // push into array, create if neccessary
        (observation[type] = observation[type] || [])
        .push(resource);
        resolve(observation);
      });
    }

    function cleanUp(resourceTypes) {
      console.log('%ccleaning up ' + JSON.stringify(resourceTypes), 'color: #333; font-weight: 500; font-size: 1.2em;');

      // _.remove(resourceTypes, function(n) { return n.match(/examples|ideas/); });

      _.each(resourceTypes, function(type) {
        delete observation[type];
      });
    }

    function start() {
      observation = {};
      select({
        type: 'start',
        date: new Date(),
        author: $rootScope.author
      });
    }

    function next() {
      // create empty arrays so go() will not fall back if no examples/ideas
      // were added
      switch ($state.params.type) {
        case 'examples':
        case 'ideas':
        if (!observation.hasOwnProperty($state.params.type)) {
          observation[$state.params.type] = [];
          break;
        }
      }

      var type = $state.params.type;
      var i = steps.indexOf(type) + 1;

      $state.go('auth.capture.go', {
        type: steps[i]
      });
    }

    function go(resource) {
      console.log(_.keys(observation));

      if (!resource) {
        return;
      }

      // if -1 (not found) go to 1 (start)
      var type = resource ? resource.type : $state.params.type; // really?
      var i = steps.indexOf(type);

      console.log('%cRESOURCE ' + JSON.stringify(resource), 'color: #ce2730; font-weight: bolder; font-size: 1.3em;');

      // console.log('%cGO(' + JSON.stringify(resource) + ')', 'color: #565a5d; font-weight: bolder; font-size: 1.3em;');
      // console.log('%cUI STATE: ' + $state.params.type, 'color: #1b99d7; font-weight: bolder; font-size: 1.3em;');
      // console.log('%cYOU ARE HERE: ' + i + ' (' + steps[i] + ')', 'color: #598e24; font-weight: bolder; font-size: 1.3em;');
      // console.log('%cTYPE: ' + type, 'color: #49e071; font-weight: bolder; font-size: 1.3em;');
      // console.log('%cSTEPS INDEX OF ' + type + ' ' + steps.indexOf(type), 'color: #3eb9d9; font-weight: bolder; font-size: 1.3em;');

      // rewind if neccessary

      // if (observation.hasOwnProperty(type)) {
      //   console.log('%c>>', 'color: #ca5f1b; font-weight: bolder; font-size: 1.3em;');
      //   i++; // go to next
      // } else if (steps.indexOf(type) >= i) {
      //   console.log('a');
      //   // must be true for the previous step to not go back
      //   while (!observation.hasOwnProperty(steps[i - 1]) && i > 0) {
      //     console.log('b');
      //     console.log('%c<<', 'color: #ca5f1b; font-weight: bolder; font-size: 1.3em;');
      //     i--; // go one step back
      //   }
      // }

      while (!observation.hasOwnProperty(steps[i - 1]) && i > 0) {
        console.log('%c<<', 'color: #ca5f1b; font-weight: bolder; font-size: 1.3em;');
        i--; // go one step back
      }

      console.log('%cTYPE ' + JSON.stringify(type), 'color: #6c00b1; font-weight: bolder; font-size: 1.3em;');
      console.log('%cSTEP INDEX ' + JSON.stringify(steps.indexOf(type)), 'color: #184cab; font-weight: bolder; font-size: 1.3em;');

      // abort if index hasn't changed
      if (i === steps.indexOf(type)) {
        console.log('%cDON\'T MOVE!', 'color: #c9073c; font-weight: bolder; font-size: 1.3em;');
        return;
      } else {
        console.log('%cGO TO: ' + i + ' (' + steps[i] + ')', 'color: #d53223; font-weight: bolder; font-size: 1.3em;');
      }

      $state.go('auth.capture.go', {
        type: steps[i]
      });
    }

    function select(resource) {
      observation[resource.type] = resource;
      next(); // TODO implement optional two-step-selection here
    }

    function get() {
      return $q(function(resolve) {
        resolve(observation);
      });
    }

    function done() {

      var obs = {
        type: 'observation',
        item_id: observation.item.id,
        kid_id: observation.kid.id,
        user_id: $rootScope.auth.id,
        niveau: observation.behaviour.niveau
      };

      debugger

      if (observation.help && observation.help.value) {
        obs.help = observation.help.value;
      }

      debugger

      _.each(observation.examples, function(example) {
        example.behaviour_id = observation.behaviour.id;
        ResourceService.create(example)
          .then(function(response) {
            console.log(response);
          });
      });

      _.each(observation.ideas, function(idea) {
        idea.behaviour_id = observation.behaviour.id;
        ResourceService.create(idea)
          .then(function(response) {
            console.log(response);
          });
      });

      ResourceService.create(obs)
        .then(function(response) {
          console.log(response);
          // go();
          observation.reset();
        });
    }

  }
}());

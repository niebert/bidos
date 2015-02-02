/* global angular, _ */

(function() {
  'use strict';

  var steps = require('../../config')
    .steps;

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q, $state) {

    console.log('%cCAPTURE SERVICE    : ' + $state.params.type, 'color: #333; font-weight: 500; font-size: 1.2em;');

    var Observation = function() {};
    var observation = new Observation();

    if ($state.params.type === undefined) {
      go();
    }

    return {
      get: get,
      done: done,
      reset: reset,
      select: select, // a.k.a. next
      add: add,
      remove: remove,
      go: go
    };


    function reset() {
      return $q(function(resolve) {
        observation = new Observation();
        this.go(0);
        resolve(observation);
      });
    }

    function remove(resource) {}

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


    function go(resource) {

      // if -1 (not found) go to 1 (start)
      var i = Math.abs(steps.indexOf($state.params.type));

      if (resource && observation.hasOwnProperty(resource.type)) {
        i++; // go to next
      } else {
        while (!observation.hasOwnProperty(steps[i]) && i > 0) {
          i--; // go to prev
        }
      }

      console.log('%cGO TO ' + steps[i], 'color: #df5138; font-weight: 500; font-size: 1.2em;', i);

      $state.go('auth.capture.go', {
        type: steps[i]
      });
    }



    function select(resource) {
      observation[resource.type] = resource;
      go(resource);
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

      if (observation.help && observation.help.value) {
        obs.help = observation.help.value;
      }

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
          go();
          observation.reset();
        });
    }

  }
}());

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

    return {
      get: get,
      done: done,
      select: select,
      add: add,
      go: go,
      cleanUp: cleanUp
    };

    function add(resource) {
      return $q(function(resolve) {
        // push into array, create if neccessary
        (observation[resource.type] = observation[resource.type] || [])
        .push(resource);

        resolve(observation);
      });
    }

    function cleanUp(resourceTypes) {
      console.log('%ccleaning up ' + JSON.stringify(resourceTypes), 'color: #333; font-weight: 500; font-size: 1.2em;');
      _.each(resourceTypes, function(type) {
        delete observation[type];
      });
    }

    function go(type) {
      return $q(function(resolve) {
        if (arguments.length === 0) {
          debugger
        }

        var next = observation.order.slice(observation.order.indexOf(type) + 1, observation.order.length);
        this.cleanUp(next);

        $state.go('auth.capture.go', {
          type: type
        });
        resolve();
      }.bind(this));
    }

    function select(resource) {
      var type = resource.type;
      var next = observation.order.slice(observation.order.indexOf(type) + 1, observation.order.length);
      var forward = next[0];
      observation[type] = resource;
      this.go(forward);
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

      _.each(observation.example, function(example) {
        ResourceService.create({
            type: 'example',
            text: example.text,
            behaviour_id: observation.behaviour.id
          })
          .then(function(response) {
            console.log(response);
          });
      });

      _.each(observation.idea, function(idea) {
        ResourceService.create({
            type: 'idea',
            text: idea.text,
            behaviour_id: observation.behaviour.id
          })
          .then(function(response) {
            console.log(response);
          });
      });

      ResourceService.create(obs)
        .then(function(response) {
          console.log(response);
          this.go();
          observation.reset();
        });
    }

  }
}());

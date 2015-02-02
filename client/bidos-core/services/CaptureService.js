/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q, $state) {

    console.log('%cCAPTURE SERVICE    : ' + $state.params.type, 'color: #333; font-weight: 500; font-size: 1.2em;');

    var Observation = function() {
      function reset() {
        this.examples = [];
        this.ideas = [];
      }

      this.order = ['kid', 'domain', 'subdomain', 'item', 'behaviour', 'help', 'examples', 'ideas', 'review'];
      this.current = 0;

      function next() {
        // var upwardsResources = this.order.slice(0, this.order.indexOf(this.current));

        // _.each(upwardsResources.reverse(), function(d) {
        //   console.log(upwardsResources, d);
        //   if (!observation.hasOwnProperty(d)) {
        //     console.log('%cGO_' + type, 'color: #1d4cbd; font-weight: 500; font-size: 1.2em;', observation);
        //     this.go(d);
        //   }
        // }, this);
      }

      function prev() {
        console.log('go to prev');
      }

      return {
        examples: [],
        ideas: [],
        reset: reset,
        next: next,
        prev: prev,
        order: this.order
      };
    };

    var observation = new Observation();

    return {
      get: get,
      done: done,
      select: select,
      add: add,
      go: go
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
      _.each(resourceTypes, function(type) {
        delete observation[type];
      });
    }

    function go(type) {
      return $q(function(resolve) {
        if (arguments.length === 0) {
          return;
        }
        $state.go('auth.capture.go', {
          type: type
        });
        resolve();
      });
    }

    function select(resource) {

      // <-- upwards / downwards -->
      var type = resource.type;
      observation[type] = resource;

      // var downwardsResources = a.slice(a.indexOf(type) + 1, a.length);

      // console.log('%cSEL_' + type, 'color: #1d4cbd; font-weight: 500; font-size: 1.2em;', resource);
      // console.log('%ccleaning up', 'color: #333; font-weight: 500; font-size: 1.2em;', JSON.stringify(a));

      // cleanUp(downwardsResources);

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

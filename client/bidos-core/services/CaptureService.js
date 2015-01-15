/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q) {

    var observation = {};

    return {
      get: getObservation,
      complete: completeObservation,
      select: selectResource,
    };

    function selectResource(resource) {
      var type = resource.type.slice(0, -1);

      switch (type) {
        case 'domain':
          delete observation.domain;
          delete observation.subdomain;
          delete observation.item;
          delete observation.behaviour;
          delete observation.help;
          break;
        case 'subdomain':
          delete observation.item;
          delete observation.behaviour;
          delete observation.help;
          break;
        case 'item':
          delete observation.behaviour;
          delete observation.help;
          break;
        case 'help':
          break;
      }

      switch (type) {
        case 'example':
        case 'idea':
          (observation[type] = observation[type] || [])
          .push(resource);
          break;
        default:
          observation[type] = resource;
      }

      console.log(observation);
    }

    function getObservation() {
      return $q(function(resolve) {
        resolve(observation);
      });
    }

    function completeObservation() {

      var obs = {
        type: 'observations',
        behaviour_id: observation.behaviour.id,
        help: observation.help.value,
        kid_id: observation.kid.id,
        user_id: $rootScope.auth.id
      };

      _.each(observation.example, function(example) { // singular here TODO
        ResourceService.create({
            type: 'examples', // plural here TODO
            text: example.text,
            behaviour_id: observation.behaviour.id
          })
          .then(function(response) {
            console.log(response);
          });
      });

      _.each(observation.idea, function(idea) { // singular here TODO
        ResourceService.create({
            type: 'ideas', // plural here TODO
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
        });
    }

  }
}());

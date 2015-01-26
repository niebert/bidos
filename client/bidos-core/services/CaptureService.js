/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q, $state) {

    var observation = {};

    return {
      get: getObservation,
      complete: completeObservation,
      select: selectResource,
    };

    function selectResource(resource) {
      var type = resource.type;
      observation[type] = resource;
      console.log(type);
      switch (type) {
        case 'kid':
          $state.go('auth.capture');
          break;
        case 'domain':
          $state.go('auth.select', {
            type: 'subdomain'
          });
          break;
        case 'subdomain':
          $state.go('auth.select', {
            type: 'item'
          });
          break;
        case 'item':
          $state.go('auth.select', {
            type: 'behaviour'
          });
          break;
        case 'behaviour':
          if (resource.niveau === 0 || resource.niveau === 4) {
            $state.go('auth.finish-observation');
          } else {
            $state.go('auth.select', {
              type: 'help'
            });
          }
          break;
        case 'help':
          $state.go('auth.finish-observation');
          break;
        case 'example':
        case 'idea':
          // push into array, create if neccessary
          (observation[type] = observation[type] || [])
          .push(resource);
          break;
        default:
          $state.go('auth.capture');
      }

      console.info(observation);
    }

    function getObservation() {
      return $q(function(resolve) {
        resolve(observation);
      });
    }

    function completeObservation() {

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
          $state.go('auth.capture');
          observation = {};
        });
    }

  }
}());

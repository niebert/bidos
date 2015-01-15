/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q) {

    var observation = {};

    return {
      add: add,
      resetItem: resetItem,
      addExample: addExample,
      getCurrent: getCurrent,
      newObservation: newObservation,
      saveObservation: saveObservation,
      selectKid: selectKid,
      selectDomain: selectDomain,
      selectSubdomain: selectSubdomain,
      selectItem: selectItem,
      selectBehaviour: selectBehaviour,
      selectHelp: selectHelp
    };

    function resetItem() {
      delete observation.domain;
      delete observation.subdomain;
      delete observation.item;
      delete observation.behaviour;
      delete observation.help;
    }

    function selectDomain(domain) {
      observation.item = null;
      observation.subdomain = null;
      observation.domain = domain;
    }

    function selectSubdomain(subdomain) {
      observation.subdomain = subdomain;
    }

    function selectHelp(help) {
      observation.help = help;
    }

    function selectBehaviour(behaviour) {
      observation.behaviour = behaviour;
    }

    function selectItem(item) {
      observation.item = item;
    }

    function getCurrent() {
      return $q(function(resolve, reject) {
        resolve(observation);
      });
    }

    function newObservation() {
      return new Observation();
    }

    function saveObservation() {
      var obs = {
        behaviour_id: observation.behaviour.id,
        examples: observation.examples,
        ideas: observation.ideas,
        help: observation.help,
        kid_id: observation.kid.id,
        user_id: $rootScope.auth.id
      };

      debugger

      ResourceService.create('observation', obs)
        .then(function(response) {
          console.log(response);
        });
    }

    function add(resource, content) {
      debugger
      observation[resource] = [].concat(content);
    }

    function selectKid(kid) {
      observation.kid = kid;
      console.log('selected kid', kid);
    }


    function addExample(example) {
      observation.examples.push(example);
    }


  }
}());

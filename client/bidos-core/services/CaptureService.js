/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('CaptureService', CaptureService);

  function CaptureService($rootScope, ResourceService, $q) {

    var observation = {
      domain: null,
      subdomain: null,
      value: null,
      help: false,
      kid: null,
      item: null,
      author_id: $rootScope.auth.id,
      examples: []
    };

    return {
      newObservation: newObservation,
      selectKid: selectKid,
      selectItem: selectItem,
      addExample: addExample,
      saveObservation: saveObservation,
      getCurrent: getCurrent,
      selectDomain: selectDomain
    };

    function selectDomain(domain) {
      observation.domain = domain;
    }

    function selectItem(item) {
      observation.item = item;

      ResourceService.get().then(function(resources) {
        observation.subdomain = _.select(resources.subdomains, {
          id: item.subdomain_id
        })[0];
      });

      console.log('selected item', item);
    }

    function getCurrent() {
      return $q(function(resolve, reject) {
        resolve(observation);
      });
    }

    function newObservation() {
      return new Observation();
    }

    function saveObservation(observation) {
      ResourceService.create('observation', observation)
        .then(function(response) {
          console.log(response);
        });
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

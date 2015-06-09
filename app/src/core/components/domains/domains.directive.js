'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosDomains', bidosDomains);

function bidosDomains() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'DomainsController',
    templateUrl: '/templates/domains.html'
  };
}


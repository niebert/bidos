'use strict';
/* global angular */

angular.module('bidos')
  .directive('bidosInstitutions', bidosInstitutions);

function bidosInstitutions() {
  return {
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: 'InstitutionsController',
    templateUrl: '/templates/institutions.html'
  };
}


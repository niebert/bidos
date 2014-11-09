(function() {
  'use strict';

  angular.module('survey.providers.constants', [])

  .constant('API_URL', 'localhost:3000')
  .constant('RESOURCE_URL', API_URL + '/surveys');

}());

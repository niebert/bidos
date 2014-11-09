(function() {
  'use strict';

  ////////////////////////////
  // ANGULAR MODULE: SURVEY //
  ////////////////////////////

  require('./survey-controllers');
  require('./survey-services');

  angular.module('survey', [
    'survey.controllers',
    'survey.services'
  ]);

  // .run(function($rootScope, $state) { $rootScope.state = $state; })

}());

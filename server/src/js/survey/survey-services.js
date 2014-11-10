(function() {
  'use strict';

  require('./survey-constants');

  angular.module('survey.service', ['survey.constants'])

  .service('SurveyService', ['$http', '$q', 'RESOURCE_URL',
    function($http, $q, RESOURCE_URL) {

    // Other requests like addItemToSurvey() can be made, e.g. to different
    // (injected) factories or services. This particular service *should* only
    // hold basic CRUD operations.

    // Errors are handled within the calling controller, not here. The
    // functions below should just return the promise, that is resolved in the
    // controller. Or vice versa, as controllers should be w/o logic but only
    // routing and state as far as possible?

    var surveys = {};

    return {
      create: createSurvey,
      read:   readSurvey,
      update: updateSurvey,
      delete: deleteSurvey,
    };

    function createSurvey(surveyFormData) {
      return $http.post(RESOURCE_URL + '/create', surveyFormData);
    }

    function readSurvey(id) {
      return $http.get(RESOURCE_URL + '/' + id);
    }

    function updateSurvey(id, surveyFormData) {
      return $http.patch(RESOURCE_URL + '/' + id + '/create', surveyFormData);
    }

    function deleteSurvey(id) {
      return $http.delete(RESOURCE_URL + '/' + id);
    }

  }]);

}());

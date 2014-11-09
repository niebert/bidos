(function() {
  'use strict';

  angular.module('survey.controller', [])

  ///////////////////////
  // SURVEY CONTROLLER //
  ///////////////////////

  .controller('SurveyCtrl',
    ['SurveyFactory', '$state',
    function(SurveyFactory, $state) {

    var vm = this;

    // post form data
    vm.create = function(surveyFormData) {
      console.info('survey:vm.create', surveyFormData);
      SurveyFactory.create(surveyFormData).then(function(response) {
        vm.survey = response.data.survey;
        $state.go('view', vm.survey.id);
      }, handleError);
    };

    // get 1 or * surveys
    vm.read = function(id) {
      console.info('survey:vm.read');
      SurveyFactory.read(id).then(function(response) {
        vm.survey = response.data.survey;
        $state.go('view', vm.survey.id);
      }, handleError);
    };

    // post form data
    vm.update = function(id) {
      console.info('survey:vm.update');
      SurveyFactory.update(id).then(function(response) {
        vm.survey = response.data.survey;
        $state.go('view', vm.survey.id);
      }, handleError);
    };

    // delete survey in vm and db
    vm.delete = function(id) {
      console.info('survey:vm.delete');
      SurveyFactory.delete(id).then(function(response) {
        vm.survey = response.data.survey;
        $state.go('list');
      }, handleError);
    };

    function handleError(response) {
      alert('Error: ' + response.data);
    }

    // init
    SurveyFactory.list().then(function(survey) {
      vm.survey = survey;
      console.info('vm', vm);
      $state.go('index');
    }, function error(err) {
      $state.go('login');
    });

  }]);


}());

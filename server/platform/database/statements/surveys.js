(function() {
	'use strict';

  module.exports = exports = {
    getSurvey: {
      name: 'getSurvey',
      text: 'SELECT * FROM surveys WHERE survey_id = $1'
    },

    getAllSurveys: {
      name: 'getAllSurveys',
      text: 'SELECT * FROM surveys'
    },

    createSurvey: {
      name: 'createSurvey',
      text: 'INSERT INTO surveys (title, description) values ($1, $2)'
    },

    updateSurvey: {
      name: 'updateSurvey',
      text: 'UPDATE surveys SET $2 WHERE survey_id = $1'
    },

    deleteSurvey: {
      name: 'deleteSurvey',
      text: 'DELETE FROM surveys WHERE survey_id = $1'
    },
  };

}());

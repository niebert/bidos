//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router'),
      _ = require('lodash');

  module.exports = exports = new Router()

    .get('readSurvey', '/:id?', function *readSurvey() {
      var result = yield this.pg.db.client.query_({
        name: 'readSurvey',
        text: 'SELECT * FROM surveys' + (this.params.id ? ' WHERE survey_id = $1' : '')
      });
      this.body = result.rows;
    })

    .post('createSurvey', '/', function *createSurvey() {
      var result = yield this.pg.db.client.query_({
        name: 'createSurvey',
        text: 'INSERT INTO surveys (title) VALUES ($1) RETURNING *'
    }, _.map(this.request.body));
      this.body = result.rows;
    })

    .patch('updateSurvey', '/:id', function *updateSurvey() {
      var result = yield this.pg.db.client.query_({
        name: 'updateSurvey',
        text: 'UPDATE surveys SET $2 WHERE survey_id = $1'
      });
      this.body = result.rows;
    })

    .delete('deleteSurvey', '/:id', function *deleteSurvey() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteSurvey',
        text: 'DELETE FROM surveys WHERE survey_id = $1'
      });
      this.body = result.rows;
    });

}());

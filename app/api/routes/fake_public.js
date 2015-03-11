//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  var faker = require('faker');

  var request = require('superagent');

  module.exports = exports = new Router()
    .get('/:resource', createFakeResource);

  function* createFakeResource() {

    this.log.info('faker test');

    request
      .post('/api/pet')
      .send({
        name: 'Manny',
        species: 'cat'
      })
      .set('X-API-Key', 'foobar')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          this.log.error(err);
        } else {
          this.log.info(res);
        }
      }.bind(this));

  }

}());

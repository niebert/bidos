//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  var faker = require('faker');

  module.exports = exports = new Router()
    .get('fake', '/fake/:resource', createFakeResource);

  function* createFakeResource() {

    this.log.info('faker test');

    var test =
      yield request
      .post('/api/pet')
      .send({
        name: 'Manny',
        species: 'cat'
      })
      .set('X-API-Key', 'foobar')
      .set('Accept', 'application/json')
      .end(function(err, res) {

      });

    this.body = test;
  }

}());

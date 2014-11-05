// jshint esnext:true
(function() {
	'use strict';

	///////////
	// stub! //
	///////////

	var _ = require('lodash'),
			Promise = require('bluebird');

	var path = require('path');

	var app = require('../');
	var request = require('supertest');

	describe('the api', function(done) {

		it('should return all x . GET /x', function(done) {
			request(app)
				.get('/api/x')
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
				.auth('asdf', 123)
				.expect(200, done);
		});

	});

}());
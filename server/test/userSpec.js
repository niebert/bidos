// jshint esnext:true
(function() {
  'use strict';

  var _ = require('lodash'),
      Promise = require('bluebird');

  var path = require('path');

  var app = require('../');
  var request = require('supertest');

  describe('bla', function(done) {
    it('should wait for the server to start', function(done) {
      setTimeout(function(){
        done();
      }, 50);
    });
  });

  describe('authentication', function(done) {

    it('should succeed with correct username and password', function(done) {
        request(app)
          .post('localhost:3000/login')
          .auth('asdf', '123', true, 'bearerToken')
          .expect(200, done);
    });

    it('should fail with username but without a password', function(done) {
        request(app)
          .post('localhost:3000/login')
          .auth('asdf', '', true, 'bearerToken')
          .expect(400, done);
    });

    it('should fail without username but with a password', function(done) {
        request(app)
          .post('localhost:3000/login')
          .auth('', '123', true, 'bearerToken')
          .expect(400, done);
    });

    it('should fail without username and password', function(done) {
        request(app)
          .post('localhost:3000/login')
          .auth('', '', true, 'bearerToken')
          .expect(400, done);
    });
  });

}());
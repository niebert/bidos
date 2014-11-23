/* global describe, it */
/* jshint esnext:true, unused:false */
'use strict';

var hippie = require('hippie');
var server = require('..')(3001);

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

const API_URL='http://localhost:3001/v1';

describe('API', function () {

  describe('GET  /user', function () {
    it('  should return all users', function (done) {
      hippie(server)
        .json()
        .get(API_URL + '/user')
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) { throw err; }
          expect(body).to.have.length.above(1);
          done();
        });
    });
  });

  describe('GET  /user/1', function () {
    it('should return a single user by id', function (done) {
      hippie(server)
        .json()
        .get(API_URL + '/user/1')
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) { throw err; }
          expect(body).to.have.length(1);
          expect(body[0]).to.have.property('id');
          expect(body[0].id).to.equal(1);
          expect(body[0].password).to.have.length(60);
          done();
        });
    });
  });

  describe('POST /user/1', function () {
    it('should create a new user', function (done) {
      hippie(server)
        .json()
        .post(API_URL + '/user/1')
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) { throw err; }
          expect(body).to.have.length(1);
          expect(body[0]).to.have.property('id');
          expect(body[0].id).to.equal(1);
          expect(body[0].password).to.have.length(60);
          done();
        });
    });
  });

});

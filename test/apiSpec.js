/* global describe, it */
/* jshint esnext:true, unused:false */
'use strict';

var _ = require('lodash');
var hippie = require('hippie');
var server = require('..')(3001);

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

const API_URL='http://localhost:3001/v1/';

var routes = require('../server/routes');

// describe('POST /auth/signup', function () {
//   it('should return an object', function (done) {
//     hippie(server)
//       .json()
//       .post(API_URL + 'auth/signup')
//       .expectStatus(200)
//       .end(function(err, res, body) {
//         if (err) { throw err; }
//         done();
//       });
//   });
// });

Object.keys(routes.private).forEach(function(d) {
  describe('GET /v1/' + d, function () {
    it('should return an object', function (done) {
      hippie(server)
        .json()
        .get(API_URL + d)
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) { throw err; }
          done();
        });
    });
  });
});

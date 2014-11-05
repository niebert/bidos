/* jshint esnext:true */

(function() {
	'use strict';

  var config = require('..')[process.env.NODE_ENV],
      db = require('../database'),
      jwt = require('koa-jwt'),
      Promise = require('bluebird'),
      Router = require('koa-router'),
      router = new Router();

  var User = require('../database').user; // user model

  function *fetchAllUsers (next) {
    this.body = User.find();
    yield next;
  }

  // for now logging out is done on the clients side by deleting the token

  module.exports = exports = router
    .get('/users', fetchAllUsers);

}());

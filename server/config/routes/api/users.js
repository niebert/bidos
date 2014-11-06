//jshint esnext:true

(function() {
	'use strict';

  var Router = require('koa-router');
  var router = new Router();

  var User = require('../../database').user; // user model

  function* allUsers(next) {
  	debugger
    var users = yield User.find().exec().then(function (users) {
    	return users;
    });

    this.body = users;
  }

  module.exports = exports = router
    .get('/users', allUsers);

}());

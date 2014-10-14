//jshint esnext:true

(function() {
	'use strict';

  var lodash = require('lodash');
  var Router = require('koa-router');
  var passport = require('../passport');
  var router = new Router();
  var co = require('co');

  router.get('/login', function *() {
    console.log("rendering login");
    yield this.render('login');
  });

  router.get('/logout', function *(next) {
    console.log("logging out");
    console.log("redirecting to /login");
    this.logout();
    this.redirect('/login');
    yield next;
  });

  module.exports = function (app) {

    var passport = require('../passport')(app);
    var statements = require('../statements')(app);

    router.post('/login', function *() {
      yield passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true
      });
    });

    return { auth: router };
  };

}());
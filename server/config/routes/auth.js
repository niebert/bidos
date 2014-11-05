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
  var currentUser;

  // https://support.zendesk.com/hc/en-us/articles/203663816-Setting-up-single-sign-on-with-JWT-JSON-Web-Token-

  function verifyCredentials(username, password) {
    return new Promise(function (resolve, reject) {
      User.findOne(username).exec()
      .then(function (user) {
        user.comparePassword(password, user.password)
        .then(function (isMatch) {
          isMatch ? resolve(user) : reject();
        }, function error(err) {
          reject();
        });
      }, function error(err) {
        reject();
      });
    });
  }

  // check for correct authentication headers. the actual authentication
  // happens at the jwt() call in ../index.js
  function* authenticate(next) { // jshint -W040
    console.log('this.request.body', this.request.body);

    var username = this.request.body.username,
        password = this.request.body.password;

    if (!username || !password) {
      this.status = 400;
      this.body = 'Must provide both username and password';
    } else {
      currentUser = yield verifyCredentials(username, password)
      .then(function (user) {
        this.status = 200;
        return user;
      }.bind(this), function error(err) {
        console.log('user', user);
        this.status = 500;
      }.bind(this));
    }

    if (!currentUser) {
      this.status = 401;
      this.body = "authentication is possible but has failed\n"
    } else {
      console.log('user', currentUser);
      yield next;
    }
  }

  function* tokenize(next) {
    var token = jwt.sign({
      username: currentUser.username // XXX user.username vs this.request.body.username
    }, config.session.secret);

    console.log('tokenize', token);

    this.body = { // jshint -W040
      token: token,
      user: this.request.body // XXX any reason the store the password in local storage?
    };
  }

  // renders ./views/login.html
  function* renderLogin() { // jshint -W040
    yield this.render('login');
  }

  // renders ./views/signup.html
  function* renderSignup() { // jshint -W040
    yield this.render('signup');
  }

  function* createUser() { // jshint -W040
    console.log('createUser', this.request.body);
    yield User.create(this.request.body)
    .then(function (user) {
      console.log('successfully created user', user);
      this.status = 200;
      return user;
    }.bind(this), function error(err) {
      console.log('failed creating user', err); // TODO return nicer error message
      this.status = 500;
    }.bind(this));

    yield next; // XXX ?
  }

  // for now logging out is done on the clients side by deleting the token

  module.exports = exports = router
    .get('/login', renderLogin)
    .get('/signup', renderSignup)
    .post('/signup', createUser)
    .post('/login', authenticate, tokenize);

}());

/* jshint esnext:true */

(function() {
	'use strict';

  var lodash = require('lodash');
  var Router = require('koa-router');
  var router = new Router();
  var jwt    = require('koa-jwt');
  var config = require('..')[process.env.NODE_ENV];

  var db = require('../database');

  var bcrypt = require('bcrypt');

  // https://support.zendesk.com/hc/en-us/articles/203663816-Setting-up-single-sign-on-with-JWT-JSON-Web-Token-

  // check for correct authentication headers. the actual authentication
  // happens at the jwt() call in ../index.js
  function* authenticate(next) { // jshint -W040

    // var body = this.request.body;
    // var user = db.User.find({
    //   where: {
    //     username: body.username
    //   }
    // }).success(function(user) {
    //   console.log('USER', user);
    //   bcrypt.compare(body.password, user.password, function(err, isMatch) {
    //     if(err) return cb(err);
    //     cb(null, isMatch);
    //   });
    // }).error(function(err) {
    //   console.log('ERROR', err);
    // });



    // Sequelize is a mess, at least it's documentation. Cannot get clean
    // access to query result. Pretty annoying. Cannot access the model's
    // instance function like comparepassword;



    var body = this.request.body;
    var user = db.User.find({
      where: {
        username: body.username
      }
    }).success(function(user) {
      console.log('USER', user.dataValues);
      bcrypt.compare(body.password, user.password, function(err) {
        if(err) { console.log('wrong pw'); } else {
        console.log('correct pw'); }
      }).error(function(err) {
        console.log('ERROR', err);
      });
    }).error(function(err) {
      console.log('ERROR', err);
    });

    if (!body.username || !body.password) {
      this.status = 400;
      this.body = 'Must provide username or password';
    } else if (body.username !== user.username || body.password !== user.password) {
      this.status = 401;
      this.body = 'Username or password incorrect';
    } else {
      yield next;
    }
  }

  function* tokenize(next) { // jshint -W040
    console.log(this.request.body);

    var token = jwt.sign({
      username: user.username
    }, config.session.secret);

    this.body = {
      token: token,
      user: user
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

    db.User.create(this.request.body)
    .success(function(user) {
      this.status = 204;
      console.log('User created successfully:', user.dataValues.username);
    }.bind(this))
    .error(function(err) {
      this.status = 507;
      console.log('Failed creating user:', err);
    }.bind(this));

  }

  // for now logging out is done on the clients side by deleting the token

  module.exports = exports = router
    .get('/login', renderLogin)
    .get('/signup', renderSignup)
    .post('/signup', createUser)
    .post('/login', authenticate, tokenize);

}());

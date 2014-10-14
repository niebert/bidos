// jshint esnext:true, noyield:true

(function() {
  'use strict';

  const co            = require('co'),
        lodash        = require('lodash'),
        Promise       = require('bluebird'),
        passport      = require('koa-passport'),
        LocalStrategy = require('passport-local').Strategy;

  var users;

  // called by passport.authenticate('local', {  ...
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log(users);
      console.log('incoming auth:', username, password);
      var user = lodash.filter(users, {username: username, password: password});

      if (user.length) {
        console.log('login successful');
        // done(null, user[0], { message: 'you are now logged in' });
        done(null, user[0]);
      } else {
        console.log('login failed');
        // done(null, false, { message: 'login failed. try again.' });
        done(null, false);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    console.log('serializing user', user);
    done(null, user.username);
  });

  // input id/username, get user object
  passport.deserializeUser(function(username, done) {
    var user = lodash.filter(users, {username: username});
    console.log('deserializing user', username);
    done(null, user[0]);
  });

  module.exports = function (app) {
    var statements = require('./statements')(app);

    // get auth table (users, passwords) TODO
    app.use(function *(next) {
      if (!users) {
        var result = yield this.pg.db.client.query_(statements.auth.users);
        users = result.rows;
      }
      yield next;
    });

    return passport;
  }.bind(this);

  // module.exports = passport;

}());

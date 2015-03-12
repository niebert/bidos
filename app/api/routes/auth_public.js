/* jshint esnext:true */

(function() {
  'use strict';

  var config = require('../config');
  var secret = config.secret.key;

  var _ = require('lodash'),
    jwt = require('koa-jwt'),
    Router = require('koa-router'),
    user;


  var sendgrid = require('sendgrid')(config.app.name, config.sendgrid.key);
  var crypto = require('co-crypto');

  var removeDiacritics = require('diacritics')
    .remove;

  Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  };

  // logging out is done on the clients side by deleting the token.
  // TODO: keep track of deployed tokens

  module.exports = exports = new Router()
    .post('/login', authenticate, tokenize)
    .post('/signup', generateUsername, createResource('user'))
    .post('/forgot', forgotPassword)
    .get('/reset/:hash', resetPassword)
    .post('/reset/:hash', setNewPassword)
    .post('/approve', approveUser);


  function* approveUser(next) {
    var result =
      yield this.pg.db.client.query_('UPDATE users SET approved = true WHERE id = $1 RETURNING *', [this.request.body.id]);

    if (result.rowCount) {
      var user = result.rows[0];
      user.type = 'user';
      var payload = {
        to: user.email,
        toname: user.name,
        from: 'admin@bidos',
        subject: '[bidos] Zugang freigeschaltet',
        text: 'Ihr Zugang ist jetzt freigeschaltet. Sie können sich mit Ihrem Benutzernamen "' + user.username + '" und Ihrem Passwort anmelden.',
        html: 'Ihr Zugang ist jetzt freigeschaltet. Sie können sich mit Ihrem Benutzernamen "' + user.username + '" und Ihrem Passwort anmelden.'
      };

      sendgrid.send(payload, function(err, json) {
        if (err) {
          console.error(err);
        }
        this.status = 200;
        console.log('email sent to ' + user.email);
        console.log(json);
      }.bind(this));
      this.status = 200;
      this.body = user;

    } else {

      this.status = 500;
      this.body = {
        error: 'failed'
      };
    }

  }

  function* resetPassword(next) {
    var result =
      yield this.pg.db.client.query_('SELECT * FROM password_reset WHERE hash = $1', [this.params.hash]);

    if (!result.rowCount) {

      this.status = 401;
      this.body = {
        error: 'reset request not found'
      };

    } else {
      this.redirect('/#/reset/' + result.rows[0].hash);
    }
  }

  function* setNewPassword(resourceType) {

    var bcrypt = require('co-bcrypt');
    this.request.body.password_hash =
      yield bcrypt.hash(this.request.body.password,
        yield bcrypt.genSalt(10));

    var password_reset;
    var userId;

    try {
      password_reset =
        yield this.pg.db.client.query_('SELECT * FROM password_reset WHERE hash = $1', [this.params.hash]);
      if (!password_reset.rows.length || password_reset.rows[0].expires < Date.now()) {
        throw new Error('some error');
      } else {
        userId = password_reset.rows[0].user_id;
      }
    } catch (err) {
      console.log('ERR', err);
      this.status = 500;
      this.body = [{
        type: 'error',
        content: 'password reset token expired or invalid'
      }];
    }

    if (!password_reset.rows.length) {
      this.status = 401;
      this.body = {
        error: 'password reset token not found'
      };
    }
    var query = 'UPDATE users SET (password_hash) = ($1) WHERE id=' + parseInt(password_reset.rows[0].user_id) + ' RETURNING *'; // pluralize
    var values = [this.request.body.password_hash];

    console.log(query);

    try {
      var result =
        yield this.pg.db.client.query_(query, values);

      if (!password_reset.rows.length) {
        this.status = 500;
        this.body = [{
          type: 'error',
          content: 'password reset token expired or invalid'
        }];
      }

      _.each(result.rows, function(r) {
        r.type = resourceType;
      });

      try {
        var userId;
        if (password_reset.rows) {
          userId = password_reset.rows[0].user_id;
        }
        yield this.pg.db.client.query_('DELETE from password_reset where user_id=$1', [userId]);
      } catch (err) {
        console.error(err);
        this.status = 500;
        this.body = [{
          type: 'error',
          content: err
        }];
      }

      this.status = 200;
      this.body = result.rows;

    } catch (err) {
      console.error(err);
      this.status = 500;
      this.body = [{
        type: 'error',
        content: err
      }];
    }
  }

  function* forgotPassword(next) {
    var hash =
      yield crypto.randomBytes(20);

    console.log(hash);

    // lookup user
    var result =
      yield this.pg.db.client.query_({
        name: 'readUser',
        text: 'SELECT * FROM auth WHERE email = $1'
      }, [this.request.body.email]);

    if (!result.rowCount) {

      // user not found
      this.status = 401;
      this.body = {
        error: 'unknown user'
      };

    } else {

      // user found
      var user = result.rows[0];
      var expires = new Date()
        .addHours(1); // 1 hour

      console.log('user found: ', user);

      var query = 'INSERT INTO password_reset (user_id, hash, expires) VALUES ($1, $2, $3) RETURNING *'; // pluralize
      var values = [user.id, hash.toString('hex'), expires];

      console.log(query, values);

      try {
        var result =
          yield this.pg.db.client.query_(query, values);

        if (!result.rowCount) {
          this.status = 500;
          this.body = {
            error: 'could not add passwort_reset database entry'
          };
        }

        console.log('password_reset database entry added');

        var payload = {
          to: user.email,
          toname: user.name,
          from: 'admin@bidos',
          subject: '[bidos] Passwort zurücksetzen',
          text: 'Folgen Sie dem folgenden Link um Ihr Passwort zurückzusetzen: ' + SERVER_URL + '/#/reset/' + hash.toString('hex'),
          html: 'Klicken Sie auf den folgenden Link um Ihr Passwort zurückzusetzen: <a href="' + SERVER_URL + '/#/reset/' + hash.toString('hex') + '">' + SERVER_URL + '/auth/reset/' + hash.toString('hex') + '</a>'
        };

        sendgrid.send(payload, function(err, json) {
          if (err) {
            console.error(err);
          }
          this.status = 200;
          console.log(json);
        }.bind(this));

        this.status = 200;

      } catch (err) {
        console.error(err);
        this.status = 500;
        this.body = [{
          type: 'error',
          content: err
        }];
      }

    }
  }

  function* authenticate(next) {
    var bcrypt = require('co-bcrypt');

    console.log('auth request: ', this.request.body.username, '//', this.request.body.password);

    var result =
      yield this.pg.db.client.query_({
        name: 'readUser',
        text: 'SELECT * FROM auth WHERE username = $1'
      }, [this.request.body.username]);

    if (!result.rowCount) {
      this.status = 401;
      this.body = {
        error: 'Unbekannter Benutzername'
      };
    } else {

      user = result.rows[0];
      console.log(this.request.body, user);

      if (!user.approved) {
        this.status = 401;
        this.body = {
          error: 'Der Benutzer ist nicht freigeschaltet'
        };
      }

      if (
        yield bcrypt.compare(this.request.body.password, user.password_hash)) {
        yield next;
      } else {
        this.status = 401;
        this.body = {
          error: 'Falsches Passwort'
        };
      }

      if (user.disabled) {
        console.log(user);
        this.status = 401;
        this.body = {
          error: 'Der Benutzer ist deaktiviert'
        };
      }

      this.status = 200;
      this.body = user;
    }
  }

  function* tokenize() {
    this.body = _.merge(user, {
      token: jwt.sign(user, secret, {
        expiresInMinutes: 60 * 24 * 7 // one week
      })
    });

    yield {}; // to satisfy jshint's need to yield just anything in a generator function
  }

  function* generateUsername(next) {
    function mkusername(name) {
      var username;
      name = removeDiacritics(name)
        .split(' ');

      if (name.length === 2) {
        username = name[0][0] + name[0][name[0].length - 1] + name[1][0]; // René Wilhelm -> rew
      } else if (name.length === 3) {
        username = name[0][0] + name[1][0] + name[2][0]; // Robert Downey Junior -> rdj
      }

      return username.toLowerCase();
    }

    function usernameExists(username) {
      return _(usernames.rows)
        .pluck('username')
        .contains(username);
    }

    var username;
    var usernames =
      yield this.pg.db.client.query_('SELECT username FROM users');

    if (!this.request.body.username) {
      username = mkusername(this.request.body.name);
    } else {
      yield next;
    }

    // console.log('usernameExists', usernameExists(username));

    while (usernameExists(username)) {
      username = username + '1';
    }

    // console.log('username', username);
    this.request.body.username = username;

    yield next;
  }

  function createResource(resourceType) {
    return function*() {

      var bcrypt = require('co-bcrypt');
      this.request.body.password_hash =
        yield bcrypt.hash(this.request.body.password,
          yield bcrypt.genSalt(10));

      delete this.request.body.password;

      if (!_.size(this.request.body)) {
        console.log('[route failure] create_' + resourceType + ': this.request.body is empty');
        this.status = 500;
      } else {

        var keys = _.keys(this.request.body);
        var values = _.values(this.request.body);
        var indices = Array.apply(0, new Array(keys.length))
          .map(function(d, i) {
            return '$' + (i + 1);
          }); // <3

        var query = {
          name: 'create_' + resourceType,
          text: 'INSERT INTO ' + resourceType + 's (' + keys + ') VALUES (' + indices + ') RETURNING *',
          values: values
        };

        console.log(query);

        try {
          var result =
            yield this.pg.db.client.query_(query);

          _.each(result.rows, function(r) {
            r.type = resourceType;
          });

          this.body = result.rows;
          var user = result.rows[0];

          var payload = {
            to: user.email,
            toname: user.name,
            from: 'admin@bidos',
            subject: '[bidos] Registrierung',
            text: 'Ihre Registrierung war erfolgreich. Sobald ein Administrator Ihren Zugang freigeschaltet hat, erhalten Sie eine E-Mail and ' + user.email + '.',
            html: 'Ihre Registrierung war erfolgreich. Sobald ein Administrator Ihren Zugang freigeschaltet hat, erhalten Sie eine E-Mail and ' + user.email + '.'
          };

          sendgrid.send(payload, function(err, json) {
            if (err) {
              console.error(err);
            }
            this.status = 200;
            console.log(json);
          }.bind(this));


        } catch (err) {
          console.error(err);
          this.status = 500;
          this.body = [{
            type: 'error',
            content: err
          }];
        }
      }
    };
  }

}());

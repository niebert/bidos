'use strict';

let bcrypt = require('co-bcrypt'); // to do password hashing

function* authenticate(next) {

  // FIXME
  // function log (level, message) {
  //   console[level]({
  //     message: message,
  //     username: this.request.body.username,
  //     password: this.request.body.password
  //   });
  // }

  function reply (status, body) {
    this.status = status;
    this.body = body;
  }

  // log every auth request
  // log('info', 'auth request').bind(this);

  // try to find the specified user in the database
  var result =
    yield this.pg.db.client.query_(
			'SELECT * FROM auth WHERE username = $1',
			[this.request.body.username]);

  // rowcount will be zero if no matching user was found
  if (!result.rowCount) {
    // log('warn', 'username unknown');
    reply(401, {error: 'Unbekannter Benutzername'});
  } else {

    // user was found in database
    this.user = result.rows[0];

    // if the user has not been approved, yet
    if (!this.user.approved) {
      // log('warn', 'user not approved');
      reply(401, {error: 'Der Benutzer ist nicht freigeschaltet'});
    }

    // user is disabled
    if (this.user.disabled) {
      // log('warn', 'user disabled');
      reply(401, { error: 'Der Benutzer ist deaktiviert'});
    }

    // compare passwords
    if (yield bcrypt.compare(this.request.body.password, this.user.password_hash)) {
      // log('info', 'auth success');
      yield next;
    } else {
      // user has given the wrong password
      // log('info', 'password failure');
      reply(401, { error: 'Falsches Passwort'});
    }
  }
}

module.exports = authenticate;

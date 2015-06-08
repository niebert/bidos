'use strict';

let bcrypt = require('co-bcrypt'); // to do password hashing

function* authenticate(next) {

  // log every auth request
  console.info('auth request', this.request.body);

  // try to find the specified user in the database
  var result =
    yield this.pg.db.client.query_(
			'SELECT * FROM auth WHERE username = $1',
			[this.request.body.username]);

  // rowcount will be zero if no matching user was found
  if (!result.rowCount) {
    console.warn('username unknown');
    this.status = 401;
    this.body = { error: 'Unbekannter Benutzername'};
  } else {

    // user was found in database
    this.user = result.rows[0];

    // if the user has not been approved, yet
    if (!this.user.approved) {
      console.warn('user not approved');
      this.status = 401;
      this.body = { error: 'Der Benutzer ist nicht freigeschaltet'};

    } else if (this.user.disabled) {
      console.warn('user disabled');
      this.status = 401;
      this.body = { error: 'Der Benutzer ist deaktiviert'};

    } else if (yield bcrypt.compare(this.request.body.password, this.user.password_hash)) {
      console.info('auth success');
      yield next;

    } else {
      // user has given the wrong password
      console.info('password failure');
      this.status = 401;
      this.body = { error: 'Falsches Passwort'};
    }
  }
}

module.exports = authenticate;

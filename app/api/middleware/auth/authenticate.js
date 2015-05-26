'use strict';
let bcrypt = require('co-bcrypt'); // to do password hashing
function* authenticate(next) {

  // log every auth request
  console.info({
    type: 'auth request',
    username: this.request.body.username,
    password: this.request.body.password
  });

  // try to find the specified user in the database
  var result =
    yield this.pg.db.client.query_(
			'SELECT * FROM auth WHERE username = $1',
			[this.request.body.username]);

  // rowcount will be zero if no matching user was found
  if (!result.rowCount) {
    console.warn({
      type: 'username unknown',
      username: this.request.body.username,
      password: this.request.body.password
    });
    this.status = 401;
    this.body = {
      error: 'Unbekannter Benutzername'
    };
  }
  else {
    // user was found in database
    this.user = result.rows[0];

    // if the user has not been approved, yet
    if (!this.user.approved) {
      console.warn({
        type: 'user not approved',
        username: this.request.body.username,
        password: this.request.body.password
      });
      this.status = 401;
      this.body = {
        error: 'Der Benutzer ist nicht freigeschaltet'
      };
    }

    // if the user is disabled
    if (this.user.disabled) {
      console.warn({
        type: 'user disabled',
        username: this.request.body.username,
        password: this.request.body.password
      });
      this.status = 401;
      this.body = {
        error: 'Der Benutzer ist deaktiviert'
      };
    }

    // compare passwords
    if (yield bcrypt.compare(this.request.body.password, this.user.password_hash)) {
      console.info({
        type: 'auth success',
        username: this.request.body.username,
        password: this.request.body.password
      });
      //this.status = 200;
      //this.body = user;
      yield next;
    }
    else {
      // password is not correct
      console.warn({
        type: 'password failure',
        username: this.request.body.username,
        password: this.request.body.password
      });
      this.status = 401;
      this.body = {
        error: 'Falsches Passwort'
      };
    }
  }
}

module.exports = authenticate;

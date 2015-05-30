'use strict';

const sendgridConfig = require('../config').sendgrid;
let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);

function* forgotPassword() {

  let hash = yield crypto.randomBytes(20);
  let emails = require('../lib/mailBody');

  console.log(hash);

  // lookup user
  let userResult =
    yield this.pg.db.client.query_({
      name: 'readUser',
      text: 'SELECT * FROM auth WHERE email = $1'
    }, [this.request.body.email]);

  if (!userResult.rowCount) {

    // user not found
    this.status = 401;
    this.body = {
      error: 'unknown user'
    };

  } else {

    // user found
    let user = userResult.rows[0];
    let expires = new Date()
      .addHours(1); // 1 hour

    console.log('user found: ', user);

    let query = 'INSERT INTO password_reset (user_id, hash, expires) VALUES ($1, $2, $3) RETURNING *'; // pluralize
    let values = [user.id, hash.toString('hex'), expires];

    console.log(query, values);

    try {
      let passwordResult = yield this.pg.db.client.query_(query, values);

      if (!passwordResult.rowCount) {
        this.status = 500;
        this.body = {
          error: 'could not add passwort_reset database entry'
        };
      }

      sendgrid.send(emails.reset, function(err, json) {
        if (err) console.error(err);
        console.log(json);
        this.status = 200;
      }.bind(this));

    } catch (err) {
      console.error(err);
      this.status = 500;
    }

  }
}

module.exports = forgotPassword;

'use strict';
const sendgridConfig = require('../../config').sendgrid;
const serverUrl = require('../../config').serverUrl;
let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);
function* forgotPassword() {
  var hash =
    yield crypto.randomBytes(20);

  console.log(hash);

  // lookup user
  var userResult =
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
    var user = userResult.rows[0];
    var expires = new Date()
      .addHours(1); // 1 hour

    console.log('user found: ', user);

    var query = 'INSERT INTO password_reset (user_id, hash, expires) VALUES ($1, $2, $3) RETURNING *'; // pluralize
    var values = [user.id, hash.toString('hex'), expires];

    console.log(query, values);

    try {
      var passwordResult =
        yield this.pg.db.client.query_(query, values);

      if (!passwordResult.rowCount) {
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
        text: 'Folgen Sie dem folgenden Link um Ihr Passwort zurückzusetzen: ' + serverUrl + '/#/reset/' + hash.toString('hex'),
        html: 'Klicken Sie auf den folgenden Link um Ihr Passwort zurückzusetzen: <a href="' + serverUrl + '/#/reset/' + hash.toString('hex') + '">' + serverUrl + '/auth/reset/' + hash.toString('hex') + '</a>'
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
module.exports = forgotPassword;

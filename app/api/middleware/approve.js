'use strict';

const sendgridConfig = require('../config').sendgrid;

let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);

/*
  1. change value in database
  2. send email to user
*/


function* approve() {

  let query = 'UPDATE users SET approved = true WHERE id = $1 RETURNING *';
  let params = [this.request.body.id];

  var result = yield this.pg.db.client .query_(query, params);

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

module.exports = approve;

'use strict';
let _ = require('lodash');
var bcrypt = require('co-bcrypt');
function* setNewPassword(resourceType) {

  this.request.body.passwordHash =
  yield bcrypt.hash(this.request.body.password,
    yield bcrypt.genSalt(10));

  var passwordReset;
  var userId;

  try {
    passwordReset =
    yield this.pg.db.client.query_('SELECT * FROM passwordReset WHERE hash = $1', [this.params.hash]);
    if (!passwordReset.rows.length || passwordReset.rows[0].expires < Date.now()) {
      throw new Error('some error');
    } else {
      userId = passwordReset.rows[0].user_id;
    }
  } catch (err) {
    console.log('ERR', err);
    this.status = 500;
    this.body = [{
      type: 'error',
      content: 'password reset token expired or invalid'
    }];
  }

  if (!passwordReset.rows.length) {
    this.status = 401;
    this.body = {
      error: 'password reset token not found'
    };
  }
  var query = 'UPDATE users SET (passwordHash) = ($1) WHERE id=' + parseInt(passwordReset.rows[0].user_id) + ' RETURNING *'; // pluralize
  var values = [this.request.body.passwordHash];

  console.log(query);

  try {
    var result =
    yield this.pg.db.client.query_(query, values);

    if (!passwordReset.rows.length) {
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
      if (passwordReset.rows) {
        userId = passwordReset.rows[0].user_id;
      }
      yield this.pg.db.client.query_('DELETE from passwordReset where user_id=$1', [userId]);
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
module.exports = setNewPassword;

'use strict';
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

module.exports = resetPassword;

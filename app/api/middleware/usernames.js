'use strict';

var _ = require('lodash');

function* usernames() {
  var query = 'SELECT username FROM usernames';

  try {
    var result =
      yield this.pg.db.client.query_(query);

    _.each(result.rows, function(r) {
      r.type = 'username';
    });

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

module.exports = usernames;

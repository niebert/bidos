'use strict';

var _ = require('lodash');

function* institutions() {
  var query = 'SELECT id, name FROM institutions';

  try {
    var result =
      yield this.pg.db.client.query_(query);

    _.each(result.rows, function(r) {
      r.type = 'institution';
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

module.exports = institutions;

'use strict';

var _ = require('lodash');

function* groups() {
  var query = 'SELECT id, name, institution_id FROM groups';

  try {
    var result =
      yield this.pg.db.client.query_(query);

    _.each(result.rows, function(r) {
      r.type = 'group';
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

module.exports = groups;

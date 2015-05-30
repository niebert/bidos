'use strict';
let _ = require('lodash');
function getResource(resourceType) {
  return function*() {

    var query = 'SELECT * FROM ' + resourceType + 's WHERE id=$1'; // pluralize
    var values = [this.params.id];

    try {
      var result =
        yield this.pg.db.client.query_(query, values);

      _.each(result.rows, function(r) {
        r.type = resourceType;
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
  };
}
module.exports = getResource;

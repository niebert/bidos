'use strict';
let _ = require('lodash');
function getAllResources(resourceType) {
  return function*() {

    var query = 'SELECT * FROM ' + resourceType + 's'; // pluralize

    try {
      var result =
        yield this.pg.db.client.query_(query);

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
module.exports = getAllResources;

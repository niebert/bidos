'use strict';
let _ = require('lodash');
function createResource(resourceType) {
  return function*() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] create_' + resourceType + ': this.request.body is empty');
      this.status = 500;
    } else {


      if (this.request.body.hasOwnProperty('type')) {
        resourceType = this.request.body.type;
        delete this.request.body.type;
      }


      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = 'INSERT INTO ' + resourceType + 's (' + keys + ') VALUES (' + indices + ') RETURNING *'; // pluralize

      console.log(query, values, indices);

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
    }
  };
}
module.exports = createResource;

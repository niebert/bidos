'use strict';

module.exports = deleteResource;

function deleteResource(resourceType) {
  return function* () {

    var query = 'DELETE FROM ' + resourceType + 's WHERE id=$1'; // pluralize
    var values = [this.params.id];

    try {

      // delete all observations first
      if (resourceType === 'kid') {
        yield this.pg.db.client.query_('DELETE FROM observations WHERE kid_id=$1', [this.params.id]);
      }

      yield this.pg.db.client.query_(query, values);

      this.body = [{
        type: resourceType,
        id: +this.params.id
      }];

    } catch (err) {
      console.error(err);
      this.status = 500;
      this.body = err;
    }
  };
}

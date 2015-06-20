'use strict';

const sendgridConfig = require('../config').sendgrid;
let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);

let _ = require('lodash');

function* feedback () {

  if (!_.size(this.request.body)) {
    this.status = 500;
  } else {

    var query = 'INSERT INTO feedback (message, author_id) VALUES ($1, $2) RETURNING *';
    var values = [this.request.body.message, this.request.body.user.id];

    try {

      var result =
        yield this.pg.db.client.query_(query, values);

      var user =
        yield this.pg.db.client.query_('SELECT * FROM users where id = $1', [values[1]]);

      var payload = {
        to: 'rene.wilhelm@gmail.com',
        toname: 'René Wilhelm',
        from: 'admin@bidos',
        subject: '[bidos] Feedback von ' + user.rows[0].name,
        text: result.rows[0].message
      };

      sendgrid.send(payload, function(err, json) {
        if (err) console.error(err);
        this.status = 200;
        console.log('feedback received', json);
      }.bind(this));

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
}

module.exports = feedback;

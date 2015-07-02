'use strict';

const sendgridConfig = require('../config').sendgrid;
let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);

let _ = require('lodash');

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      }
      else {
        cls = 'string';
      }
    }
    else if (/true|false/.test(match)) {
      cls = 'boolean';
    }
    else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function* feedback() {

  if (!_.size(this.request.body)) {
    this.status = 500;
  }
  else {

    var ip = this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress || this.req.socket.remoteAddress || this.req.connection.socket.remoteAddress;
    var query = 'INSERT INTO feedback (message, author_id, x_resolution, y_resolution, ip, user_agent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    var values = [
      this.request.body.message,
      this.request.body.user.id,
      this.request.body.stuff.resolution.x,
      this.request.body.stuff.resolution.y,
      ip,
      this.request.headers['user-agent']];

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
        text: `${result.rows[0].message}\n\n${JSON.stringify(this.request.body.stuff, null, 2)}`,
        html: `<p>${result.rows[0].message}</p><p>${syntaxHighlight(this.request.body.stuff)}</p>`
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

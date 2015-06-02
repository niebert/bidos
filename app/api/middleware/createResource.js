'use strict';
let _ = require('lodash');
const sendgridConfig = require('../config').sendgrid;
let sendgrid = require('sendgrid')(sendgridConfig.user, sendgridConfig.key);

function createResource(resourceType) {
  return function*() {

    var bcrypt = require('co-bcrypt');
    this.request.body.password_hash =
      yield bcrypt.hash(this.request.body.password,
        yield bcrypt.genSalt(10));

    delete this.request.body.password;

    if (!_.size(this.request.body)) {
      console.log('[route failure] create_' + resourceType + ': this.request.body is empty');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = 'INSERT INTO ' + resourceType + 's (' + keys + ') VALUES (' + indices + ') RETURNING *';

      console.log(query);

      try {
        var result =
          yield this.pg.db.client.query_(query, values);

        _.each(result.rows, function(r) {
          r.type = resourceType;
        });

        this.body = result.rows;
        var user = result.rows[0];

        var payload = {
          to: user.email,
          toname: user.name,
          from: 'admin@bidos',
          subject: '[bidos] Registrierung',
          text: 'Ihre Registrierung war erfolgreich. Sobald ein Administrator Ihren Zugang freigeschaltet hat, erhalten Sie eine E-Mail and ' + user.email + '.',
          html: 'Ihre Registrierung war erfolgreich. Sobald ein Administrator Ihren Zugang freigeschaltet hat, erhalten Sie eine E-Mail and ' + user.email + '.'
        };

        sendgrid.send(payload, function(err, json) {
          if (err) {
            console.error(err);
          }
          this.status = 200;
          console.log(json);
        }.bind(this));


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

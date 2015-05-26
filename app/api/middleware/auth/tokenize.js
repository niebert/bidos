'use strict';
let jwt = require('koa-jwt');
let _ = require('lodash');
const secret = require('../../config').secret;
function* tokenize() {
  this.body = _.merge(this.user, {
    token: jwt.sign(this.user, secret, {
      expiresInMinutes: 60 * 24 * 7 // one week
    })
  });

  yield {}; // to satisfy jshint's need to yield just anything in a generator function
}
module.exports = tokenize;

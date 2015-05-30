'use strict';

let jwt = require('koa-jwt');
let _ = require('lodash');

const secret = require('../config').secret;

function* tokenize() {
  this.body = _.merge(this.user, {
    token: jwt.sign(this.user, secret, {
      expiresInMinutes: 60 * 24 * 7 // one week
    })
  });
}

module.exports = tokenize;

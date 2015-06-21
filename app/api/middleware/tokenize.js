'use strict';

let jwt = require('koa-jwt');
let _ = require('lodash');

const secret = require('../config').secret;

function* tokenize() {
  this.body = _.merge(this.user, {
    token: jwt.sign(this.user, secret, {
      user_id: this.user.id,
      expiresInMinutes: 60 * 8 // eight hours
    })
  });
}

module.exports = tokenize;

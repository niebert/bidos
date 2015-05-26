'use strict';

let jwt = require('koa-jwt');

const secret = require('../config').secret;

// catch authorization failure and custom 401 handling to hide koa-jwt
// errors from users: instantly moves on to the next middleware and handles
// eventually thrown errors.
function* authHandler(next) {
  console.log('auth first');
  try {
    yield next; // -> jwt authorization
  } catch (err) {
    if (err.status === 401) {
      this.status = 401; // authentication is possible but has failed
      this.body = 'Failure. Protected resource. No Authorization header found.\n';
      console.warn(JSON.stringify({type: 'auth', message: 'Failure: No authentication header found.', details: this.headers, date: new Date()}));
    }
    else {
      throw err;
    }
  }
}

function* auth(next) {
  console.log('auth second');
  yield authHandler.call(this, jwt({secret: secret}).call(this, next));
}

module.exports = auth;

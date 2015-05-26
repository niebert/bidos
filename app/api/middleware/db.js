'use strict';

let pg = require('koa-pg');
let config = require('../config').db;

// catches database error
function* dbHandler(next) {
  console.log('db second');
  try {
    yield next;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('Database offline');
    }
    else {
      console.error('Database error');
    }
    this.throw(err);
  }
}

function* db(next) {
  console.log('db second');
  yield dbHandler.call(this, pg(config).call(this, next)); // <3
}

module.exports = db;

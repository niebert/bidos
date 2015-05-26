'use strict';
let pg = require('koa-pg');
const config = require('../config').db;

// catches database error
function* dbHandler(next) {
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
  yield dbHandler.call(this, pg(config).call(this, next)); // <3
}

module.exports = db;

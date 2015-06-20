'use strict';

let Router = require('koa-router');

let feedback = require('../middleware/feedback');

module.exports = new Router()
  .post('feedback', '/', feedback);

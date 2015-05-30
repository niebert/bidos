'use strict';

let Router = require('koa-router');
let createFakeResource = require('../middleware/createFakeResource');

module.exports = new Router()
  .get('/:resource', createFakeResource);

'use strict';

let Router = require('koa-router');

let vanilla = require('../middleware/vanilla');

module.exports = new Router()
  .get('getVanillaResources', '/vanilla', vanilla);

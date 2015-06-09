'use strict';

let Router = require('koa-router');

let vanilla = require('../middleware/vanilla');
let vanillaAnon = require('../middleware/vanillaAnon');

module.exports = new Router()
  .get('getVanillaResources', '/vanilla', vanilla)
  .get('getVanillaResources', '/anon', vanillaAnon);

'use strict';

let Router = require('koa-router');

let institutions = require('../middleware/institutions');
let usernames = require('../middleware/usernames');
let groups = require('../middleware/groups');

module.exports = new Router()
  .get('/institutions', institutions)
  .get('/usernames', usernames)
  .get('/groups', groups);

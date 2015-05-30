'use strict';

let Router = require('koa-router');

let approve = require('../middleware/approve');
let authenticate = require('../middleware/authenticate');
let createResource = require('../middleware/createResource');
let forgotPassword = require('../middleware/forgotPassword');
let generateUsername = require('../middleware/generateUsername');
let resetPassword = require('../middleware/resetPassword');
let setNewPassword = require('../middleware/setNewPassword');
let tokenize = require('../middleware/tokenize');

let router = new Router()

  .post('/login', authenticate, tokenize)
  .post('/signup', generateUsername, createResource('user')) // TODO break out hash func in between?

  .post('/forgot', forgotPassword) // user clicks forgot, api sends email
  .get('/reset/:hash', resetPassword) // user clicks link, api sends link

  .post('/reset/:hash', setNewPassword) // user sets new password
  .post('/approve', approve); // new users must separately be approved

module.exports = router;

'use strict';

let Router = require('koa-router');

// Login: authenticate && tokenize
let authenticate = require('../middleware/auth/authenticate');
let tokenize = require('../middleware/auth/tokenize');

// Signup: generate username, (hash password?), create resource
let generateUsername = require('../middleware/auth/generate-username');
let createResource = require('../middleware/auth/create-user');

// Forgot: api sends link, user clicks link, user sets new password
let forgotPassword = require('../middleware/auth/password-forgot');
let resetPassword = require('../middleware/auth/password-reset');
let setNewPassword = require('../middleware/auth/password-new');

// Admins approves user
let approveUser = require('../middleware/auth/approve');

module.exports = exports = new Router()
  .post('/login', authenticate, tokenize)
  .post('/signup', generateUsername, createResource('user'))
  .post('/forgot', forgotPassword)
  .get('/reset/:hash', resetPassword)
  .post('/reset/:hash', setNewPassword)
  .post('/approve', approveUser);

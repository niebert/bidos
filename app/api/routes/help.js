'use strict';

var Router = require('koa-router');

function* help() {
	this.body = 'Help is on it\'s way!';
  this.status = 201;
}

module.exports = new Router()
  .get('/', help);

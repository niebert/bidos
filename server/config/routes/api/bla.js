//jshint esnext:true

(function() {
	'use strict';

  var Router = require('koa-router');
  var router = new Router();

  function* api(next) {
    this.body = 'secured api routes go here\n';
    yield next;
  }

  module.exports = exports = router
    .get('/', api);

}());

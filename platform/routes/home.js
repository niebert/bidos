//jshint esnext:true

(function() {
	'use strict';

  var Router = require('koa-router');
  var router = new Router();

  function* index() {
    yield this.render('index');
  }

  module.exports = exports = router
    .get('/', index);

}());
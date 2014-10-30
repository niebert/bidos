//jshint esnext:true

(function() {
	'use strict';

  var Router = require('koa-router');
  var router = new Router();

  module.exports = exports = {
    'public': router
      .get('/', index)
  };

  function* index(next) {
    yield this.render('index');
  };

}());
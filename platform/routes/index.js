//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router'),
      _ = require('lodash'),
      fs = require('fs'),
      router = {}; // lots of

  if (!Object.keys(router).length) {
    fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      router[file.split('.')[0]] = require('./' + file);
    });
  }

var actions = ['show', 'new', 'edit', '_form', '_layout'];

  var templateRouter = new Router()

  // SUCKS! FIXME!

  .get('renderIndex', '/', function *renderIndex() {
    yield this.render('index');
  })

  // SUCKS! FIXME!

  .get('renderTemplate', '/:resource/:action?', function *renderTemplate() {
    if (_.keys(router).indexOf(this.params.resource) >= 0) {
      if (!this.params.action) {
        yield this.render(this.params.resource + '/' + 'index');
      } else if (actions.indexOf(this.params.action) >= 0) {
        console.log(this.params.resource + '/' + this.params.action);
        yield this.render(this.params.resource + '/' + this.params.action);
      } else {
        this.status = 405;
        this.body = { failure: 'requested view could not be found' };
      }
    } else {
      this.status = 404;
      this.body = { failure: 'requested resource could not be found' };
    }
  });

  // SUCKS! FIXME!

  module.exports = exports = _.merge({templates: templateRouter}, router);
}());

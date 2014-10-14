//jshint esnext:true

(function() {
	'use strict';

	var Router = require('koa-router');
	var lodash = require('lodash');

  var router = new Router();

  module.exports = function (app) {
    var statements = require('../statements')(app);

    // get all tables names of tables containing a column 'ts'
    router.get('/tables', function*(next) {
      var result = yield this.pg.db.client.query_(statements.helpers.sensorTables);
      this.body = lodash.map(result.rows, 'table_name');
      this.status = result.rowCount ? 200 : 204;
    });

    // router.get('/tables',
    //   function*(next) {
    //     this.tables = yield this.pg.db.client.query_(statements.helpers.sensorTables);
    //     yield next;
    //   },
    //   function*(next) {
    //     var tables = lodash.map(this.tables.rows, 'table_name');
    //     lodash.each(tables, function*(tableName) {
    //       var columns = yield this.pg.db.client.query_(lodash.merge({
    //         values: [tableName]
    //       }, statements.helpers.columns));
    //       console.log(columns.rows);
    //     }.bind(this));
    //     yield next;
    //   },
    //   function*(next) {
    //     console.log(lodash.map(this.tables.rows, 'table_name'));
    //     console.log(this.columns);
    //     this.body = this.columns;
    //   });

    // router.get('/columns/:tableName', function*() {
    //   var result = yield this.pg.db.client.query_(lodash.merge({
    //     values: [this.params.tableName]
    //   }, statements.helpers.columns));
    //   this.body = result;
    //   this.status = result.rowCount ? 200 : 204;
    // });

    return { helpers: router };
  };

}());
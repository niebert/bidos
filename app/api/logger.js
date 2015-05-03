(function() {
  'use strict';

  var bunyan = require('bunyan');

  var main = function() {
    return function*(next) {
      this.log = bunyan.createLogger({
        name: 'bidos',
        streams: [{
          level: 'error',
          path: `log/${process.env.NODE_ENV}.log`
        }, {
          level: 'warn',
          path: `log/${process.env.NODE_ENV}.log`
        }, {
          level: 'info',
          path: `log/${process.env.NODE_ENV}.log`
        }, {
          level: 'debug',
          path: `log/${process.env.NODE_ENV}.log`
        }],
      });

      //this.log.info({
      //  headers: this.headers,
      //  request: {
      //    ip: this.request.ip,
      //    body: this.request.body,
      //    method: this.request.method
      //  }
      //});

      yield next;
    };
  };

  module.parent ? module.exports = exports = main : main();
}());


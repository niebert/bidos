'use strict';
let bunyan = require('bunyan');

let logger = function() {
  return function* (next) {
    this.log = bunyan.createLogger({
      name: 'bidos', // TODO import from somewhere
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
      }]
    });

    // TODO
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

module.parent ? module.exports = logger : logger();

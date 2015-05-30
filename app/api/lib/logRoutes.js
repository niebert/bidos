'use strict';
let chalk = require('chalk');
let _ = require('lodash');
var columnify = require('columnify');

function logRoutes(routes, mountPoint, name) {
  console.log('\n' + chalk.cyan('>> ' + name + ' routes'));
  console.log(columnify(_.map(routes, function(d, i) {
    return {
      'PATH': mountPoint + i,
      'request method': _(d.methods)
        .map()
        .tail()
        .join(' ')
    };
  }), {
    columnSplitter: ' | '
  }));
}

module.exports = logRoutes;

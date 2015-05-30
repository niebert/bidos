'use strict';

let fs = require('fs');
let path = require('path');

function excludeFiles(file) {
  return (file.indexOf('.') !== 0) &&
         (file !== 'index.js');
}

function exportFiles(file) {
  let f = path.basename(file, '.js');
  exports[f] = require('./' + f);
}

fs.readdirSync(__dirname)
  .filter(excludeFiles)
  .forEach(exportFiles);

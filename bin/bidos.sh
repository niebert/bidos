#!/usr/bin/env zsh
#
set -e

function prepare-cordova() {
  pwd
  read
  cd app

  cordova create apk de.uni-koblenz-landau.de.bidos BiDoS
  cd apk
  cordova platform add android

  cd www

  mkdir js
  cd js
  mv index.js cordova_init.js
  ln -s ../../../dist/bidos.js
  ln -s ../../dist/bidos.min.js
  ln -s ../../dist/bidos.min.js.map

  mkdir css
  cd ../css
  ln -s ../../../dist/bidos.css

  cd ..
  rm index.html
  ln -s ../../src/index.html

  mkdir templates && cd templates && for i in ../../../src/**/*.html; do ln -s $i; done
}

$@

#!/usr/bin/env zsh
#
set -e

function build-dist() {
  gulp build 1>/dev/null
}

function build-apk() {
  cd app/apk
  cordova build 1>/dev/null
}

function prepare-cordova() {
  cordova create app/apk de.uni-koblenz-landau.de.bidos BiDoS --link-to=app/dist
  cd app/apk
  cordova platform add android
}

function help() {
  echo "prepare-cordova: create cordova project in app/apk and symlinks in app/apk/www"
}

$@

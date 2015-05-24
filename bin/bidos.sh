#!/usr/bin/env zsh
# Sun May 24 00:26:28 CEST 2015
#

set -e

cd ~bidos || (echo "bidos not found"; return)

usage="Usage: $0 [api|www] [dev]"

if [[ $# -eq 0 ]]; then
  echo $usage; return
fi

if [[ $1 == "-n" ]]; then
  noop=echo; shift
fi

if [[ $1 == "api" ]]; then
  server=api; shift
elif [[ $1 == "www" ]]; then
  server=www; shift
else
  echo $usage; return
fi

if [[ $1 == "dev" ]]; then
  NODE_ENV=development; shift
elif [[ ! $1 ]]; then
  NODE_ENV=production
else
  echo $usage; return
fi

export NODE_ENV

case $NODE_ENV in
  development) node_env="\e[31m$NODE_ENV\e[00m" ;;
  production) node_env="\e[32m$NODE_ENV\e[00m" ;;
esac

echo "run bidos \e[34m$server\e[00m server in $node_env mode?"; read

[[ $server == "www" ]] && [[ $NODE_ENV == "development" ]] && unset server

$noop gulp $server

# function build-dist() {
#   gulp build 1>/dev/null
# }

# function build-apk() {
#   cd app/apk
#   cordova build 1>/dev/null
# }

# function prepare-cordova() {
#   cordova create app/apk de.uni-koblenz-landau.de.bidos BiDoS --link-to=app/dist
#   cd app/apk
#   cordova platform add android
# }

# function help() {
#   echo "prepare-cordova: create cordova project in app/apk and symlinks in app/apk/www"
# }

# $@

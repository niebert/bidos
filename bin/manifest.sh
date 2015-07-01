#!/usr/bin/env zsh

# generate manifest.appcache

DIST_DIR=app/dist

function cached_files() {
  cd $DIST_DIR
  ls -1 **/^manifest.appcache*(.) # dist files
  grep -Eho 'lib/.[a-zA-Z0-9/\._-]+' ../src/index.html # bower components
  grep -Eho 'http[s]://[a-zA-Z0-9/\.:?_=-]+' ../src/index.html # remote imports
  cd -
}

cat << EOF
CACHE MANIFEST
# version: $(cat package.json | jq -r '.version')
# date: $(date +%x\ %X)
# id: $(date +%s | md5sum | cut -d" " -f1)

CACHE:
$(cached_files)

NETWORK:
http://*
https://*
*

SETTINGS:
prefer-online
EOF

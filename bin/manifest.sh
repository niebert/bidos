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

function build_number() {
  # get and increment build number <3
  build=$(awk '{print $NF+1}' .build)
  echo $build > .build
  echo $build
}

cat << EOF
CACHE MANIFEST
# version: $(gulp version 2>&1 >/dev/null)
# date: $(date +%x\ %X)
# id: $(date +%s | md5sum | cut -d" " -f1)
# build $(build_number)

CACHE:
$(cached_files)

NETWORK:
http://*
https://*
*

SETTINGS:
prefer-online
EOF

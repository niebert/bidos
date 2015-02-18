#!/usr/bin/env zsh

# generate build/manifest.appcache

client=($(find client -type f))
build=($(find build -type f))
bower=($(grep -Ehor 'lib/.[a-zA-Z0-9/\._-]+' client | grep '\.'))
remote=($(grep -Ehor 'http[s]/[a-zA-Z0-9/\._-]+' client))

cached_files=($client $build $bower $remote)

cat << EOF > $1/manifest.appcache
function build_number() {
  # get and increment build number <3
  build=$(awk '{print $NF+1}' .build)
  echo $build > .build
  echo $build
}
CACHE MANIFEST
# date: $(date +%x\ %X)
# version: $(date +%s | md5sum | cut -d- -f1)
# build $(build_number)

CACHE:
$(print -l $cached_files)

NETWORK:
http://*
https://*
*

SETTINGS:
prefer-online

EOF

#!/usr/bin/env zsh

# generate build/manifest.appcache

client=($(find client -type f))
build=($(find build -type f))
bower=($(grep -Ehor 'lib/.[a-zA-Z0-9/\._-]+' client | grep '\.'))
remote=($(grep -Ehor 'http[s]/[a-zA-Z0-9/\._-]+' client))

cached_files=($client $build $bower $remote)

cat << EOF > $1/manifest.appcache
CACHE MANIFEST
# date: $(date +%x\ %X)
# version: $(date +%s | md5sum | cut -d- -f1)

CACHE:
$(print -l $cached_files)

NETWORK:
http://*
https://*
*

SETTINGS:
prefer-online

EOF

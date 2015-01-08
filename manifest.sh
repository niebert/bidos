#!/usr/bin/env zsh

# generate build/manifest.appcache

client=($(find client -type f))
build=($(find build -type f))
bower=($(grep -Ehor 'lib/.[a-zA-Z0-9/\._-]+' client))
remote=($(grep -Ehor 'http[s]/[a-zA-Z0-9/\._-]+' client))

cat << EOF > build/manifest.appcache
CACHE MANIFEST
# date: $(date +%x\ %X)
# version: $(date +%s | md5sum | cut -d- -f1)

CACHE:
$(print -l $client $build $bower $remote)

NETWORK:
http://*
https://*
*

SETTINGS:
prefer-online

EOF

#!/usr/bin/env zsh
# Sun May 24 23:17:28 CEST 2015

set -e
cd ~bidos/app/src
find . -name '*.js' | sed '/\.\/index.js/d;/\.\/auth\/lib/d;/index.js/s/\/index.js//g;/_disabled/d' | while read -r l; do
	echo "require('${l//.js}');"
done > ../dist/index.js

# for i in *(/); do [[ -d $i ]] && [[ -f $i/index.js ]

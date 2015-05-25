#!/usr/bin/env zsh
# Sun May 24 23:17:28 CEST 2015

set -e
cd app/src
find . -name '*.js' | grep -v 'index.js\|_disabled'| while read -r l; do
	echo "require('${l//.js}');"
done > index.js

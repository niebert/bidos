#!/usr/local/bin/zsh
# Sun May 24 20:26:47 CEST 2015

test -d app/dist/templates || mkdir -p app/dist/templates
cp -v app/src/index.html app/dist
cp -vr app/src/**/*.html app/dist/templates

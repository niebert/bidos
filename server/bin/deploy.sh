#!/usr/bin/env zsh

ch="92.51.147.239"

ssh ch test -d bidos || ssh git clone https://github.com/rwilhelm/bidos.git
ssh ch 'cd bidos npm install'
ssh ch 'cd bidos bower install'
ssh ch 'cd bidos && make dball-osx'

# Options:
# --dbuser=<dbuser>
# --development (default, watches)
# --production




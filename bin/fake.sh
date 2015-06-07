#!/usr/local/bin/zsh
#Thu Mar 19 04:04:48 CET 2015
set -e

function fake() {
	url="$URL/v1/crud/$1"
	curl -qs $URL/v1/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- $url
}

repeat  2    fake institution
repeat  4    fake group
repeat  64   fake kid
repeat  4    fake user
repeat  128  fake observation

echo -e " \e[0;32m$NODE_ENV setup done"

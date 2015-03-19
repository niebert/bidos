#!/usr/local/bin/zsh

PORT=3010

fake() {
	curl -s lo:$PORT/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- lo:$PORT/v1/$1
}

fake-user() {
	curl -s lo:$PORT/fake/user | curl -s -XPOST -H "Content-Type: application/json" -d @- lo:$PORT/auth/signup
}

repeat 2 fake institution
repeat 4 fake group
repeat 64 fake kid
repeat 128 fake observation
repeat 4 fake-user user


#!/usr/local/bin/zsh

PORT=3000

fake() {
	curl -s bidos.uni-koblenz.de:$PORT/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- bidos.uni-koblenz.de:$PORT/v1/$1
}

fake-user() {
	curl -s bidos.uni-koblenz.de:$PORT/fake/user | curl -s -XPOST -H "Content-Type: application/json" -d @- bidos.uni-koblenz.de:$PORT/auth/signup
}

repeat 2 fake institution
repeat 4 fake group
repeat 64 fake kid
repeat 128 fake observation
repeat 4 fake-user user



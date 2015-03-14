#!/usr/local/bin/zsh

if ! which tmux >/dev/null; then
	echo tmux not found; exit 1
fi

export PORT=3002
export NODE_ENV=development
local BASEDIR=.

tmux new-session -d -s bidos

tmux new-window -k -t bidos:1 -n api
tmux send-keys -t bidos:1 "cd $BASEDIR && gulp api" C-m

tmux new-window -k -t bidos:2 -n www
tmux send-keys -t bidos:2 "cd $BASEDIR && gulp www" C-m

fake() {
	curl -s lo:3002/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- lo:3002/v1/$1
};

cd app/config/database
make dbdrop dbcreate dbschema

repeat 03 fake institution
repeat 12 fake group
repeat 64 fake kid

curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "approved": true }' lo:3002/auth/signup

repeat 5 curl -s lo:3002/fake/user | curl -s -XPOST -H "Content-Type: application/json" -d @- lo:3002/auth/signup

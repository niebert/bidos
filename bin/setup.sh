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
if [[ $NODE_ENV -ne "development" ]]; then
	tmux send-keys -t bidos:2 "cd $BASEDIR && gulp www" C-m
else
	tmux send-keys -t bidos:2 "cd $BASEDIR && gulp" C-m
fi

tmux new-window -k -t bidos:3 -n log
tmux send-keys -t bidos:3 "cd $BASEDIR && tail -F log/$NODE_ENV.log | ./node_modules/.bin/bunyan" C-m

createuser bidos
createdb bidos_production
createdb bidos_test
createdb bidos_development

cd app/config/database
PORT=3010 NODE_ENV=development make dbdrop dbcreate dbschema dbusers && NODE_ENV="development" iojs seeds.js seeds.json && ./fake.sh

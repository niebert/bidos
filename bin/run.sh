#!/usr/local/bin/zsh

if ! which tmux >/dev/null; then
	echo tmux not found; exit 1
fi

export PORT=3002
export NODE_ENV=development
local BASEDIR=.

tmux new-session -d -s bidos

tmux new-window -k -t bidos:1 -n api
tmux send-keys -t bidos:1 "cd $BASEDIR && NODE_ENV=development gulp api" C-m

tmux new-window -k -t bidos:2 -n www
tmux send-keys -t bidos:2 "cd $BASEDIR && NODE_ENV=development gulp www" C-m

tmux attach -t bidos

 

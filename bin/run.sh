#!/usr/local/bin/zsh

if ! which tmux >/dev/null; then
	echo tmux not found; exit 1
fi

export PORT=3010
export NODE_ENV=development

NAME=bidos

tmux new-session -d -s ${NAME}-${NODE_ENV}

tmux new-window -k -t ${NAME}:1 -n api
tmux send-keys -t ${NAME}:1 "NODE_ENV=development gulp api" C-m

tmux new-window -k -t ${NAME}:2 -n www
tmux send-keys -t ${NAME}:2 "NODE_ENV=development gulp" C-m

tmux new-window -k -t ${NAME}:3 -n applog
tmux send-keys -t ${NAME}:3 "tail -F log/${NODE_ENV}.log | ./node_modules/.bin/bunyan -l warn" C-m

tmux new-window -k -t ${NAME}:4 -n pglog
tmux send-keys -t ${NAME}:4 "NODE_ENV=development sudo tail -f /var/log/postgresql/postgresql-9.4-main.log" C-m

tmux new-window -k -t ${NAME}:5 -n psql
tmux send-keys -t ${NAME}:5 "psql -U ${NAME} ${NAME}_${NODE_ENV}" C-m

tmux attach -t ${NAME}


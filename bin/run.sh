#!/usr/local/bin/zsh -e
#Thu Mar 19 02:12:45 CET 2015

NAME=bidos
HOST=$(hostname -f)

case $NODE_ENV in
	"production")   PORT=3000  ;;
	"development")  PORT=3010  ;;
	"test")         PORT=3020  ;;
	*)
		NODE_ENV=development
		PORT=3010
		;;
esac

cat << EOF | column -t
NODE_ENV: $NODE_ENV
PORT: $PORT
NAME: $NAME
HOST: $HOST
URL: http://$HOST:$PORT
EOF

tmux new-session -d -s ${NAME}_${NODE_ENV}

tmux new-window -k -t ${NAME}_${NODE_ENV}:1 -n api
tmux send-keys -t ${NAME}_${NODE_ENV}:1 "NODE_ENV=$NODE_ENV gulp api" C-m

tmux new-window -k -t ${NAME}_${NODE_ENV}:2 -n www
tmux send-keys -t ${NAME}_${NODE_ENV}:2 "NODE_ENV=$NODE_ENV gulp" C-m

tmux new-window -k -t ${NAME}_${NODE_ENV}:3 -n applog
tmux send-keys -t ${NAME}_${NODE_ENV}:3 "tail -F log/${NODE_ENV}.log | ./node_modules/.bin/bunyan -l warn" C-m

tmux new-window -k -t ${NAME}_${NODE_ENV}:4 -n pglog
tmux send-keys -t ${NAME}_${NODE_ENV}:4 "tail -f /var/log/postgresql/postgresql-9.4-main.log" C-m

tmux new-window -k -t ${NAME}_${NODE_ENV}:5 -n psql
tmux send-keys -t ${NAME}_${NODE_ENV}:5 "psql -U ${NAME} ${NAME}_${NODE_ENV}" C-m

tmux attach -t ${NAME}_${NODE_ENV}


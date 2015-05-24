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

session=${NAME}_${NODE_ENV}

tmux new-session -d -s ${NAME}_${NODE_ENV}

tmux new-window -k -t $session:1 -n api-dev
tmux send-keys -t $session:1 "bin/bidos api dev" C-m

tmux new-window -k -t $session:2 -n www-dev
tmux send-keys -t $session:2 "bin bidos www dev" C-m

tmux new-window -k -t $session:3 -n applog
tmux send-keys -t $session:3 "tail -F log/${NODE_ENV}.log | ./node_modules/.bin/bunyan -l warn" C-m

tmux new-window -k -t $session:4 -n pglog
tmux send-keys -t $session:4 "tail -f /var/log/postgresql/postgresql-9.4-main.log" C-m

tmux new-window -k -t $session:5 -n psql
tmux send-keys -t $session:5 "psql -U ${NAME} $session" C-m

tmux attach -t $session


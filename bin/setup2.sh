#!/usr/local/bin/zsh
#Thu Mar 19 01:41:07 CET 2015

# set -x

NAME=bidos
HOST=$(hostname -f)

case (NODE_ENV) in
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

set +e # allow to fail
sudo -u postgres dropdb ${NAME}_${NODE_ENV}
sudo -u postgres dropuser $NAME
set -e

sudo -u postgres createuser $NAME
sudo -u postgres psql -c "ALTER USER bidos WITH PASSWORD 'bidos'"
sudo -u postgres createdb -O $NAME ${NAME}_${NODE_ENV}

cd ~/$NAME/bin/db

psql -U $NAME -e -f schema.sql ${NAME}_${NODE_ENV}
curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@$NAME", "password": "123", "username": "admin", "approved": true }' localhost:$PORT/auth/signup

iojs seeds.js seeds.json

set +e

fake() {
	if [[ $1 -eq "user" ]]; then
		url="lo:$PORT/auth/signup"
	else
		url="lo:$PORT/v1/$1"
	fi

	curl -s lo:$PORT/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- $url
}

set +e
repeat  2    fake institution
repeat  4    fake group
repeat  64   fake kid
repeat  128  fake observation
repeat  4    fake user
set -e

echo -e "\e[0;32mok"

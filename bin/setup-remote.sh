#!/usr/local/bin/zsh
#Thu Mar 19 04:04:48 CET 2015
set -e

NAME=bidos
# HOST=$(hostname -f)

if [[ -z !$HOST ]]; then return; fi

case $NODE_ENV in
	"production")   PORT=3000  ;;
	"development")  PORT=3010  ;;
	"test")         PORT=3020  ;;
	*)
		echo "Usage NODE_ENV={production|development|test} $0"
		exit 1
		;;
esac

export NODE_ENV
export PORT

URL=http://$HOST:$PORT

cat << EOF | column -t
NODE_ENV: $NODE_ENV
PORT: $PORT
NAME: $NAME
HOST: $HOST
URL: $URL
EOF

echo "press enter to continue"; read

# setup database user (can fail)

set +e
sudo -u postgres dropuser bidos
sudo -u postgres createuser bidos
sudo -u postgres psql -c "ALTER USER bidos WITH PASSWORD 'bidos'"
set -e

# setup database and schema

sudo -u postgres dropdb bidos_$NODE_ENV
sudo -u postgres createdb -O bidos bidos_$NODE_ENV
sudo -u postgres psql -q -U bidos -f bin/db/schema.sql bidos_$NODE_ENV

echo -e "\e[1;37mdatabase:\e[0;32m √\e[0m"

# create admin user

url=$URL/auth/signup
curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@$NAME", "password": "123", "username": "admin", "approved": true, "type": "user"}' $url 1>/dev/null

echo -e "\e[1;37madmin user:\e[0;32m √\e[0m"

function fake() {
	if [[ $1 == "user" ]]; then
		url="$URL/auth/signup"
	else
		url="$URL/v1/$1"
	fi

	curl -qs $URL/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- $url
}

if [[ $NODE_ENV == "production" ]]; then
	echo -e "\e[0;35m$NODE_ENV no fake data\e[0m"
	exit 0
fi


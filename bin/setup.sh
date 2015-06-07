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

dropdb ${NAME}_${NODE_ENV}
# dropuser $NAME

# createuser $NAME
# psql -c "ALTER USER bidos WITH PASSWORD 'bidos'"
createdb -O $NAME ${NAME}_${NODE_ENV}

# sudo -u postgres dropdb ${NAME}_${NODE_ENV}
# sudo -u postgres dropuser $NAME

# sudo -u postgres createuser $NAME
# sudo -u postgres psql -c "ALTER USER bidos WITH PASSWORD 'bidos'"
# sudo -u postgres createdb -O $NAME ${NAME}_${NODE_ENV}

cd bin/db
psql -U $NAME -f schema.sql ${NAME}_${NODE_ENV} 1>/dev/null
echo -e "\e[0;35mdatabase set up\e[0m"
url=$URL/auth/signup
curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@$NAME", "password": "123", "username": "admin", "approved": true, "type": "user"}' $url 1>/dev/null
echo -e "\e[0;33madmin user created\e[0m"
# NODE_ENV=localdev iojs seeds.js
# iojs seeds.js seeds.json

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


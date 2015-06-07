#!/usr/local/bin/zsh
#Thu Mar 19 04:04:48 CET 2015
# set -e

NAME=bidos

if [[ $(hostname -f) == "bidos.uni-koblenz.de" ]]; then
else
	SERVER=localhost
fi

case $NODE_ENV in
	"production")   PORT=3000  ;;
	"development")  PORT=3010  ;;
	"localdev")     PORT=3010  ;;
	"test")         PORT=3020  ;;
	*)
		echo "Usage NODE_ENV={production|development|test} $0"
		exit 1
		;;
esac

URL=http://$SERVER:$PORT

export NODE_ENV
export PORT
export URL

cat << EOF | column -t
NODE_ENV: $NODE_ENV
PORT: $PORT
NAME: $NAME
SERVER: $SERVER
URL: $URL
EOF

echo "press enter to continue"; read

./bin/setup-db.sh bin/db/schema.sql
./bin/setup-admin.sh
./bin/setup-seed.sh
./bin/setup-fake.sh

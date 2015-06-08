#!/usr/local/bin/zsh
# Thu Mar 19 04:04:48 CET 2015
set -e

case $NODE_ENV in
	("production")
		SERVER=bidos.uni-koblenz.de:3000
		;;
	("development")
		SERVER=bidos.uni-koblenz.de:3010
		;;
	("localdev")
		SERVER=localhost:3010
		;;
	("test")
		SERVER=bidos.uni-koblenz.de:3020
		;;
	*)
		echo "Usage NODE_ENV={production|development|test} $0"
		exit 1
		;;
esac

# create admin user
url="http://$SERVER/auth/signup"
echo $url
curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "approved": true, "type": "user"}' $url 1>/dev/null

echo -e "\e[1;37madmin user:\e[0;32m √\e[0m"

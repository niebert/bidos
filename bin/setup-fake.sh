#!/usr/local/bin/zsh
# Thu Mar 19 04:04:48 CET 2015
set -e

# create fake data

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

function fake() {
	url="http://$SERVER/v1/crud/$1"
	curl -qs $SERVER/v1/fake/$1 | curl -s -XPOST -H "Content-Type: application/json" -d @- $url
}

repeat  2    fake institution
repeat  4    fake group
repeat  4    fake user
repeat  64   fake kid
repeat  128  fake observation
echo -e "\n\e[1;37mfake resources:\e[0;32m √\e[0m"

return 0

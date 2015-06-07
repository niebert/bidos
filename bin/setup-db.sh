#!/usr/local/bin/zsh
# Thu Mar 19 04:04:48 CET 2015
set -e

schema=$1

# we need to use sudo on debian/arch

if [[ $(hostname -f) == "bidos.uni-koblenz.de" ]]; then
	alias createuser="sudo -u postgres createuser"
	alias dropuser="sudo -u postgres dropuser"
	alias createdb="sudo -u postgres createdb"
	alias dropdb="sudo -u postgres dropdb"
	alias psql="sudo -u postgres psql"
fi

# setup database user (can fail)

# set +e
# dropuser bidos
# createuser bidos
# psql -c "ALTER USER bidos WITH PASSWORD 'bidos'"
# set -e

# setup database and schema

dropdb bidos_$NODE_ENV
createdb -O bidos bidos_$NODE_ENV
psql -U bidos -f $schema bidos_$NODE_ENV 1>/dev/null

echo -e "\e[1;37mdatabase:\e[0;32m √\e[0m"

return 0

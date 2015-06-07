#!/usr/local/bin/zsh
# Thu Mar 19 04:04:48 CET 2015
set -e

# create admin user

url=$URL/auth/signup

curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "approved": true, "type": "user"}' $url 1>/dev/null

echo -e "\e[1;37madmin user:\e[0;32m √\e[0m"

#!/usr/local/bin/zsh
# Thu Mar 19 04:04:48 CET 2015
set -e

# input seed into db tables

cd bin/db
NODE_ENV=localdev iojs seeds.js
cd -

echo -e "\e[1;37mdefault seed:\e[0;32m √\e[0m"

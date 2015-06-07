#!/usr/local/bin/zsh
#Thu Mar 19 04:04:48 CET 2015
set -e
HOST=localhost PORT=3010 NODE_ENV=development bin/setup.sh
cd bin/db
NODE_ENV=localdev iojs seeds.js
echo -e "\e[0;32mdefault data imported\e[0m"
cd -
NODE_ENV=localdev URL=localhost:3010 bin/fake.sh 1>/dev/null
echo -e "\e[0;34mfake resources created\e[0m"

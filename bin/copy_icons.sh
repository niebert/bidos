#!/usr/local/bin/zsh
test ! -d app/dist/img && mkdir -p app/dist/img
for i in $(egrep -ho 'ic_.[a-z]+.*svg' -r app/src | sort -u); do
	if [[ ! -f app/dist/img/$i ]]; then
		cp bower_components/material-design-icons/**/production/$i app/dist/img;
	fi
done

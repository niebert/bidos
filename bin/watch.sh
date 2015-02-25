#!/usr/bin/env zsh
#
set -e

fswatch -0 -r app/src | xargs -0 -n1 echo | while read -r l; do
	case $l:e in
		html) make templates ;;
		js) make js ;;
		css) make css ;;
	esac
done

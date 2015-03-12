#!/usr/bin/env zsh
#
set -e

fswatch -0 -r app/src | xargs -0 -n1 echo | while read -r l; do
  case $l:e in
    js) make js ;;
    css) make css ;;
    html) make templates ;;
  esac
done

#!/usr/local/bin/zsh
egrep -rho 'material-design-icons/[a-z0-9/_.]+' app/src | while read -r l; do cp -v app/assets/$l app/dist/img/$l:t; done

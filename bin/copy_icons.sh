#!/usr/local/bin/zsh
a=($(egrep -ho 'ic_.[a-z]+.*svg' -r app/src | sort -u))
# echo $a
for i in $a; do cp bower_components/material-design-icons/**/$i app/dist/img; done

# egrep -rho 'material-design-icons/[a-z0-9/_.]+' app/assets | while read -r l; do cp -v bower_components/$l app/dist/img/$l:t; done


# cd app/img
# mkdir tmp
# mv $a tmp
# rm *svg
# mv tmp/* .
# cd -
# ls -l

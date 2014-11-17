#!/usr/local/bin/zsh

src=$1
new=$2

cd client/src/js/resources
cp -r $src $new
# zmv -n '(*)($src)(*)' '${1}$new${3}'

for i in *$src*; do
  target=$(echo $i | sed "$src/$new/g")
  mv $i $target
done

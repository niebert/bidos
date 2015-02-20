#!/usr/local/bin/zsh
test -d app/dist || make dist
cd app/apk
cordova build
echo run\?
read a
test $a && cordova run
version=$(egrep '\bversion|\bname' package.json | cut -d: -f2- | sed 's/[",]//g'"]')
apk=app/apk/platforms/android/ant-build/CordovaApp-debug.apk
cp $apk ~/Desktop/bidos-$version.apk


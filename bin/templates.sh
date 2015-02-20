#!/usr/local/bin/zsh
test -d app/dist || make dist
cd app/apk
cordova build 1>/dev/null
cd -
nfo=($(egrep '\bversion|\bname' package.json | cut -d: -f2- | sed 's/[",]//g'))
name=$nfo[1]
version=$nfo[2]
apk=app/apk/platforms/android/ant-build/CordovaApp-debug.apk
build=$(cat .build)
cp $apk $name-$version-build$build.apk
open .


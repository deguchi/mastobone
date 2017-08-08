#!/bin/sh

echo 'Android build clean'
rm -rf android/build && rm -rf ios/build
cd ./android
./gradlew clean
cd ..
react-native run-android

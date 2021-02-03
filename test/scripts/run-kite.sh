#!/usr/bin/env bash

cd ../KITE

# configure $KITE_HOME
./configureMacCI.sh

echo 'Running tests...'
cd $KITE_HOME/KITE-Example-Test

# setup maven wrapper
mvn -N io.takari:maven:0.7.7:wrapper

# build
./mvnw clean install -DskipTests -ntp

# run tests
java -Dkite.firefox.profile="$KITE_HOME"/third_party/firefox-h264-profiles/ -cp "$KITE_HOME/KITE-Engine/target/kite-jar-with-dependencies.jar:target/*" org.webrtc.kite.Engine $GITHUB_WORKSPACE/test/scripts/conf.json
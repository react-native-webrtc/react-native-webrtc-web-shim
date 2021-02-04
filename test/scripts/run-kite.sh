#!/usr/bin/env bash

cd ../KITE

# configure $KITE_HOME
./configureMacCI.sh

echo 'Running tests...'
cd $GITHUB_WORKSPACE/test/kite

# setup maven wrapper
mvn -N io.takari:maven:0.7.7:wrapper

# build
./mvnw clean install -DskipTests -ntp

# run tests
$KITE_HOME/scripts/mac/path/r configs/all.config.json

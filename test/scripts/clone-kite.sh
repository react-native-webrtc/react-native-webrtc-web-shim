#!/usr/bin/env bash
brew install coreutils

git clone https://github.com/webrtc/KITE.git ../KITE
cd ../KITE

# setup maven wrapper
mvn -N io.takari:maven:0.7.7:wrapper

# configure $KITE_HOME
ghead -n -29 configureMac.sh > configureMacCI.sh
chmod +x configureMacCI.sh
./configureMacCI.sh

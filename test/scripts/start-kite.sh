#!/usr/bin/env bash

cd ../KITE

# configure $KITE_HOME
./configureMacCI.sh

echo 'Starting Grid...'
$KITE_HOME/localGrid/startGrid.sh
echo 'Started Grid...'

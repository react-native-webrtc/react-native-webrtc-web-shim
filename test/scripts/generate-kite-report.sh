#!/usr/bin/env bash

cd ../KITE

# configure $KITE_HOME
./configureMacCI.sh

echo 'Running tests...'
cd $GITHUB_WORKSPACE/test/kite

# generates static site for report in allure-report folder
$KITE_HOME/third_party/allure-2.10.0/bin/allure generate kite-allure-reports

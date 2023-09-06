#!/usr/bin/env bash
set -e

cd ../KITE

# configure $KITE_HOME
./configureMacCI.sh

# install browsers and drivers
cd $KITE_SCRIPT_DIR
sed -i'' -e s/INSTALL_BROWSERS=FALSE/INSTALL_BROWSERS=TRUE/ ./gridConfig.sh

chmod +x *.sh
source ./gridConfig.sh
echo "Creating local folders for grid"

sed -i'.backup' "s~kill -9~echo~g" *.sh
sed -i'.backup' "s~rew cask install~rew install --cask~g" *.sh
rm *.backup

# configure versions
GECKO_VERSION="v0.29.0"
CHROMEDRIVER_VERSION="116.0.5845.96"
FIREFOX_VERSION="117"
CHROME_VERSION="116"

sed -i'.backup' "s~GECKO_VERSION=v0.28.0~GECKO_VERSION=$GECKO_VERSION~" ./gridConfig.sh
sed -i'.backup' "s~CHROMEDRIVER_VERSION=114.0.5735.90~CHROMEDRIVER_VERSION=$CHROMEDRIVER_VERSION~" ./gridConfig.sh
sed -i'.backup' "s~FIREFOX_VERSION=116~FIREFOX_VERSION=$FIREFOX_VERSION~" ./gridConfig.sh
sed -i'.backup' "s~CHROME_VERSION=115~CHROME_VERSION=$CHROME_VERSION~" ./gridConfig.sh

$GITHUB_WORKSPACE/test/scripts/createFolderLocalGrid.sh
sleep 1

if [[ "$INSTALL_BROWSERS" = "TRUE" ]]
then
  echo "Installing Chrome"
  $KITE_HOME/scripts/mac/installChrome.sh
  echo "Chrome Version: $(/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version)"
  echo "Installing Firefox"
  $KITE_HOME/scripts/mac/installFirefox.sh
  echo "Firefox Version: $(/Applications/Firefox.app/Contents/MacOS/firefox --version)"
else
  echo "Skipping Chrome and Firefox installation"
fi

# enable safari automation
sudo safaridriver --enable

echo "Installing Drivers"
$KITE_HOME/scripts/mac/installDrivers.sh
echo "Installing Selenium"
$KITE_HOME/scripts/mac/installSelenium.sh

echo "Installing Kite"
cd $KITE_HOME
./mvnw clean install -DskipTests -ntp

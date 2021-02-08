# Demo App

## Setup

Generate a new Expo app with the following command:

```
expo-cli init --npm -t expo-template-blank --non-interactive WebRtcDemo

# add webrtc dependencies
npx add-dependencies react-native-webrtc react-native-webrtc-web-shim webrtc-adapter

# eject to allow custom native libraries (react-native-webrtc)
expo eject --npm

# copy these demo files to your app
mkdir web
wget -O App.js              https://raw.githubusercontent.com/ruddell/react-native-webrtc-web-shim/main/test/demo/App.js
wget -O AppStyles.js        https://raw.githubusercontent.com/ruddell/react-native-webrtc-web-shim/main/test/demo/AppStyles.js
wget -O RoundedButton.js    https://raw.githubusercontent.com/ruddell/react-native-webrtc-web-shim/main/test/demo/RoundedButton.js
wget -O web/index.html      https://raw.githubusercontent.com/ruddell/react-native-webrtc-web-shim/main/test/demo/web/index.html
```

## Running

```
# start the browser version of the demo
npm run web

# start the iOS version of the demo
npm run ios

# start the Android version of the demo
npm run android
```

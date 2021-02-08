#!/usr/bin/env bash

# install expo
npm install -g expo-cli

# generate the app
cd ../
expo-cli init --npm -t expo-template-blank --no-install --non-interactive WebRtcDemo
cd WebRtcDemo

# add webrtc dependencies
npx add-dependencies react-native-webrtc webrtc-adapter

# link library
npm install
npm link react-native-webrtc-web-shim

cp $GITHUB_WORKSPACE/demo/* ./

expo build:web

# launch client at http://localhost:5000
npx serve web-build &

# warm up heroku backend to ensure it's started
curl -m 1 https://nodejs-webrtc-signaling-server.herokuapp.com/ || true

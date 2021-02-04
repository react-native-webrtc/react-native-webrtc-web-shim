# KITE Test for react-native-webrtc-web-shim

This repository contains automated end-to-end tests that ensure compatibility with all major browsers.

It utilizes the open source Kite Framework (https://github.com/webrtc/KITE/) to test a matrix of different browsers to ensure broadcasting and viewing works as expected.

| User One | User Two | Works? |
| -------- | -------- | ------ |
| Chrome   | Chrome   | ✅     |
| Chrome   | Safari   | ✅     |
| Chrome   | Firefox  | ✅     |
| Firefox  | Chrome   | ✅     |
| Firefox  | Safari   | ✅     |
| Firefox  | Firefox  | ✅     |
| Safari   | Chrome   | ✅     |
| Safari   | Safari   | ✅     |
| Safari   | Firefox  | ✅     |

## Test Script

1. Open web app using the `react-native-webrtc-web-shim` library
2. Grant video and join the room
3. Check the published video
4. GetStats on all the PeerConnections
5. Take a screenshot
6. Stay in the stream until the end of the test

## Pre-requisites

- KITE 2.0 Setup ([instructions](https://github.com/webrtc/KITE/blob/master/README.md))

## Run

```
cd test/kite

# compile, run tests, and open the dashboard
./scripts/all.sh
```

```
# compile only (mvn clean install -DskipTests)
$KITE_HOME/scripts/mac/path/c.sh
```

```
# run only
$KITE_HOME/scripts/mac/path/r.sh configs/all.config.json
```

```
# open dashboard only (allure serve kite-allure-reports)
$KITE_HOME/scripts/mac/path/a.sh
```

## Test output

Each will generate allure report found in `kite-allure-report/` folder. Open the dashboard with the command from the last section.

## Config

The test config file can be found at:

```
configs/all.config.json
```

### Important parameters

Set the address of your Selenium Hub:

```
"remoteAddress": "http://localhost:4444/wd/hub"`
```

Set your Chrome version and OS according to what is available on your Grid. You can use `localhost` as the platform name if the grid is running on your localhost, KITE will automatically set it according to your OS.

```
"browsers": [
    {
      "browserName": "chrome",
      "version": "76",
      "platform": "WINDOWS",
      "headless": false
    }
  ]
```

Set the browser combinations (0 = Chrome, 1 = Firefox, 2 = Safari):

```
"matrix": [
  [0,0], [0,1], [0,2]
]
```

### Report parameters

Whether to take screenshot for each test/client (if false, it will still take screenshot in case of failure):

```
"takeScreenshotForEachTest": true
```

### GetStats parameters

```
"getStats" : {
  "enabled": true,
  "statsCollectionTime": 2,
  "statsCollectionInterval": 1,
  "peerConnections": ["window.webRtcPeers[0]"],
  "selectedStats" : ["inbound-rtp", "outbound-rtp", "candidate-pair"]
}
```

Whether to call getStats:

```
"enabled": true
```

How long to collect stats for (in seconds)

```
"statsCollectionTime" : 4
```

Interval between 2 getStats calls (in seconds)

```
"statsCollectionInterval" : 2
```

You should not need to change any other parameter.

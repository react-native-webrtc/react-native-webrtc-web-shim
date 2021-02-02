# react-native-webrtc-web-shim

> Add WebRTC support for `react-native-web`, with minimal changes to your existing React Native app.

## Requirements

This library assumes you have an existing React Native application using [`react-native-webrtc`](https://github.com/react-native-webrtc/react-native-webrtc).

## Installation

Install via `npm` or `yarn`

```bash
npm install react-native-webrtc-web-shim
```

## Setup

### Replace Imports

Replace the import statement of `react-native-webrtc` to import from `react-native-webrtc-web-shim` instead.

```javascript
-import { RTCPeerConnection } from 'react-native-webrtc';
+import { RTCPeerConnection } from 'react-native-webrtc-web-shim';

```

### Change WebRTC Code

#### RTCView

When displaying the `RTCView` component, pass it the `stream` object as a prop instead of `streamURL`. On Web, this component renders an HTML5 video tag.

```javascript
<RTCView
  -streamURL={stream.toURL()}
  +stream={stream}
/>
```

#### Track Listener

Add an `ontrack` listener to your `RTCPeerConnection` object, similar to the `onaddstream` listener.

```javascript
// existing code, keep this for native support
webRtcPeer.onaddstream = async ({ stream }) =>
  await addVideo(sessionId, stream);

// add an ontrack listener for web support
webRtcPeer.ontrack = async ({ track, streams }) => {
  if (track.kind === 'video') {
    await addVideo(sessionId, streams[0]);
  }
};
```

### Contributing

#### Local Build

Due to [this React issue](https://github.com/facebook/react/issues/13991), to run locally you will need to link `react` in this project and your application.

```bash
cd node_modules/react
npm link
cd ../../MyApp
npm link react

```

Alternatively, you can package the app and install it directly. Note you will need to re-package the app to apply any changes.

```bash
npm pack
cd ../MyApp
npm install ../react-native-webrtc-web-shim/react-native-webrtc-web-shim-*.tgz
```

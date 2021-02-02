# react-native-webrtc-web-shim

> Add WebRTC support for `react-native-web`, with minimal changes to your existing React Native app.

## Requirements

This library assumes you have an existing `react-native` application using `react-native-webrtc`.

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

When displaying the `RTCView` component, pass it the `stream` object as a prop instead of `streamURL`.

```javascript
<RTCView
  -streamURL={stream.toURL()}
  +stream={stream}
/>
```

#### Track Listener

Add an `ontrack` listener to your `RTCPeerConnection` object, similar to the `onaddstream` listener.

```javascript
webRtcPeer.onaddstream = async ({ stream }) =>
  await addVideo(sessionId, stream);
// add an ontrack listener for Safari support
webRtcPeer.ontrack = async ({ track, streams }) => {
  if (track.kind === 'video') {
    await addVideo(sessionId, streams[0]);
  }
};
```

### Contributing

#### Local Build

Due to [this React issue](https://github.com/facebook/react/issues/13991), it is not possible to use `npm link`. To run locally you will need to package the app and install the `.tgz` file in your React Native app:

```bash
npm pack
cd ../MyApp
npm install ../react-native-webrtc-web-shim/react-native-webrtc-web-shim-*.tgz
```

Please make sure to run `npm run prettier && npm run lint` before opening a pull request.

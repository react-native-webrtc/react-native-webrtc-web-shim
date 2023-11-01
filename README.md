[<img src="https://avatars.githubusercontent.com/u/42463376" alt="React Native WebRTC" style="height: 6em;" />](https://github.com/react-native-webrtc/react-native-webrtc-web-shim)

# React-Native-WebRTC-Web-Shim

[![npm version](https://img.shields.io/npm/v/react-native-webrtc-web-shim)](https://www.npmjs.com/package/react-native-webrtc-web-shim)
[![npm downloads](https://img.shields.io/npm/dm/react-native-webrtc-web-shim)](https://www.npmjs.com/package/react-native-webrtc-web-shim)
[![Discourse topics](https://img.shields.io/discourse/topics?server=https%3A%2F%2Freact-native-webrtc.discourse.group%2F)](https://react-native-webrtc.discourse.group/)

Add support for `react-native-web` to a `react-native-webrtc` app.

## Getting Started

Use one of the following preferred package install methods to immediately get going.  

**npm:** `npm install react-native-webrtc-web-shim --save`  
**yarn:** `yarn add react-native-webrtc-web-shim`  
**pnpm:** `pnpm install react-native-webrtc-web-shim`

## Extra Required Steps

Import directly from our library instead of `react-native-webrtc`.

```javascript
-import { RTCPeerConnection } from 'react-native-webrtc';
+import { RTCPeerConnection } from 'react-native-webrtc-web-shim';
```

#### RTCView

When displaying the `RTCView` component, pass it the `stream` object as a prop instead of `streamURL`.  
On Web, this component renders an HTML5 video tag.

```javascript
<RTCView
  -streamURL={stream.toURL()}
  +stream={stream}
/>
```

#### Track Listener

Add the `ontrack` listener to your `RTCPeerConnection` object, similar to the `onaddstream` listener.

```javascript
// existing code, keep this for native support
webRtcPeer.onaddstream = async ({ stream }) => {
  await addVideo( sessionId, stream );
};

// add the ontrack listener for web support
webRtcPeer.ontrack = async ({ track, streams }) => {
  if ( track.kind === 'video' ) {
    await addVideo( sessionId, streams[ 0 ] );
  }
};
```

## Community

Come join our [Discourse Community](https://react-native-webrtc.discourse.group/) if you want to discuss any React Native and WebRTC related topics.  
Everyone is welcome and every little helps.  

## Related Projects

Looking for extra functionality coverage?  
The [react-native-webrtc](https://github.com/react-native-webrtc) organization provides a number of packages which are more than useful when developing Real Time Communication applications.  

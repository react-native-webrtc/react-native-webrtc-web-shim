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

Import the `RTCView` component from our library instead of `react-native-webrtc`.

```javascript
import { RTCView } from 'react-native-webrtc-web-shim';
```

When displaying the `RTCView` component make sure to give it the `stream` object as a prop instead of `streamURL`. That will allow us to render an HTML5 video when applicable.

Change this.

```javascript
<RTCView streamURL={stream.toURL()} />
```

To be like this.

```javascript
<RTCView stream={stream} />
```

## Community

Come join our [Discourse Community](https://react-native-webrtc.discourse.group/) if you want to discuss any React Native and WebRTC related topics.  
Everyone is welcome and every little helps.

## Related Projects

Looking for extra functionality coverage?  
The [react-native-webrtc](https://github.com/react-native-webrtc) organization provides a number of packages which are more than useful when developing Real Time Communication applications.

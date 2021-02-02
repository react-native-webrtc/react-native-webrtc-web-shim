import React from 'react';
import { RTCView as OriginalRTCView } from 'react-native-webrtc';

export default function RTCView({ stream, ...props }) {
  return <OriginalRTCView streamURL={stream.toURL()} {...props} />;
}

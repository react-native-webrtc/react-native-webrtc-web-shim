import React from 'react';
/* eslint-disable-next-line camelcase */
import { unstable_createElement } from 'react-native-web';

const Video = React.forwardRef((props, ref) =>
  unstable_createElement('video', { ...props, ref }),
);
Video.displayName = 'Video';

export default function RTCView({ stream, ...props }) {
  const videoRef = React.createRef();
  React.useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <Video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ flex: 1 }}
      {...props}
    />
  );
}

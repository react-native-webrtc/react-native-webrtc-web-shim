import React from 'react';
/* eslint-disable-next-line camelcase */
import { unstable_createElement } from 'react-native-web';

const Video = React.forwardRef((props, ref) =>
  unstable_createElement('video', { ...props, ref }),
);
Video.displayName = 'Video';

export default React.memo(function RTCView({ stream, videoProps = {} }) {
  const videoRef = React.createRef();
  React.useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <Video
      style={{ flex: 1, height: '80%' }}
      muted
      autoPlay
      // controls
      playsInline
      ref={videoRef}
      {...videoProps}
    />
  );
});

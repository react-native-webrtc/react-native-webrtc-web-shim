import RTCView from './RTCView';

// add 'release' method to the MediaStream prototype matching React Native's MediaStream release()
window.MediaStream.prototype.release = function release() {
  this.getTracks().forEach((track) => track.stop());
};

window.MediaStreamTrack.prototype._switchCamera = function _switchCamera() {
  console.warn('_switchCamera is not implemented on web.');
};

const { MediaStream, MediaStreamTrack } = window;

export { MediaStream, MediaStreamTrack, RTCView };

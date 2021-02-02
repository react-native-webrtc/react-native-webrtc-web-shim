import RTCView from './RTCView';

// add 'release' method to the MediaStream prototype matching React Native's MediaStream release()
window.MediaStream.prototype.release = function release() {
  this.getTracks().forEach((track) => track.stop());
};

window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
  stream.getTracks().forEach((track) => this.addTrack(track, stream));
};

const {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
} = window;

const { mediaDevices, permissions } = navigator;

const registerGlobals = () => {
  window.mediaDevices = navigator.mediaDevices;
  window.permissions = navigator.permissions;
};

export {
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStreamTrack,
  mediaDevices,
  permissions,
  // customizations
  registerGlobals,
  RTCPeerConnection,
  MediaStream,
  RTCView,
};

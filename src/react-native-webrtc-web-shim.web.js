import RTCView from './RTCView';

window.MediaStream.prototype.release = function release() {
  this.getTracks().forEach((track) => track.stop());
};

window.MediaStreamTrack.prototype._switchCamera = function _switchCamera() {
  console.warn('_switchCamera is not implemented on web.');
};

const {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCRtpTransceiver,
  RTCRtpReceiver,
  RTCRtpSender,
  RTCErrorEvent,
  MediaStream,
  MediaStreamTrack,
} = window;

const { mediaDevices, permissions } = navigator;

function registerGlobals() {
  window.mediaDevices = navigator.mediaDevices;
  window.permissions = navigator.permissions;
}

export {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCRtpTransceiver,
  RTCRtpReceiver,
  RTCRtpSender,
  RTCErrorEvent,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  permissions,
  registerGlobals,
  RTCView,
};

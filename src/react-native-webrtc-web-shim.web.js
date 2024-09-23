import RTCView from './RTCView';

if (typeof window !== "undefined") {

window.MediaStream.prototype.release = function release() {
  this.getTracks().forEach((track) => track.stop());
};

window.MediaStreamTrack.prototype._switchCamera = function _switchCamera() {
  console.warn('_switchCamera is not implemented on web.');
};

}

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
} = typeof window !== "undefined" ? window : {};

const { mediaDevices, permissions } = typeof window !== "undefined" ? navigator : {};

function registerGlobals() {
  if (typeof window !== "undefined") {
    window.mediaDevices = navigator.mediaDevices;
    window.permissions = navigator.permissions;
  }
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

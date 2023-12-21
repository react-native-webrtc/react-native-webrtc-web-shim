import React from 'react';
import {
  Alert,
  SafeAreaView,
  TextInput,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import {
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc-web-shim';
import styles from './AppStyles';
import RoundedButton from './RoundedButton';
import adapter from 'webrtc-adapter';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomInput: '1234',
      joinedRoom: null,
      alertText: null,
      videoDevices: [],
      peers: new Map(),
      streams: new Map(),
      earlyCandidates: new Map(),
      wsSessionId: null,
      isFront: false,
    };
    window.component = this;
  }

  componentDidMount() {
    this.connectWs();
  }

  connectWs = () => {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.setState({ alertText: null });
    }
    // const wsEndpoint = 'ws://localhost:8088';
    const wsEndpoint = 'wss://nodejs-webrtc-signaling-server.herokuapp.com/';
    // eslint-disable-next-line no-undef
    this.ws = new WebSocket(wsEndpoint);

    this.ws.onopen = () => {
      console.log('WebSocket Client Connected');
      this.setState({ alertText: null });
    };
    this.ws.onmessage = (e) => {
      this.handleMessage(JSON.parse(e.data));
    };
    this.ws.onclose = (e) => {
      console.log(`Websocket Closed, ${e.code} ${e.reason}`);
      // show an error message
      this.setState({
        alertText:
          'Websocket is closed, is the backend started? Tap here to try reconnecting.',
      });
    };
  };

  sendMessage = (message) => {
    message.sessionId = this.state.wsSessionId;
    this.ws.send(JSON.stringify(message));
  };

  joinOrLeaveRoom = () => {
    // leave the room if already in one
    if (this.state.joinedRoom) {
      this.sendMessage({ action: 'leave', room: this.state.joinedRoom });
      [...this.state.peers.keys()].forEach(async (key) => {
        try {
          await this.closePeer(key);
        } catch (e) {
          console.warn(`Error closing peer ${key}`);
        }
      });
      this.setState({ joinedRoom: null, room: '1234' });
      return;
    }
    const roomInputValue = this.state.roomInput;
    // alert that the room name is required
    if (roomInputValue.length === 0) {
      Alert.alert('Room Name is required.');
      return;
    }
    // actually join the room if the above checks pass
    this.setState({ joinedRoom: roomInputValue }, () => {
      this.sendMessage({ action: 'join', room: this.state.joinedRoom });
    });
  };
  handleMessage = async (message) => {
    try {
      const sessionId = message.sessionId;
      switch (message.action) {
        case 'created':
          console.log(`Created session with id: ${sessionId}`);
          this.setState({ wsSessionId: sessionId });
          break;
        case 'join':
          console.log(`User ${sessionId} joined room`);
          // when another user joins, create an RTCPeerConnection and send them an SDP offer
          await this.createPeer(sessionId, null);
          break;
        case 'sdpOffer':
          console.log(`SDP Offer received from ${sessionId}`);
          // when another user sends an SDP offer, replay with an SDP Answer
          await this.createPeer(sessionId, message.jsep);
          break;
        case 'sdpAnswer':
          console.log(`SDP Answer received from ${sessionId}`);
          // when another user sends an SDP Answer, process it
          await this.state.peers
            .get(sessionId)
            .setRemoteDescription(message.jsep);
          break;
        case 'trickle':
          console.log(`ICE Candidate received from ${sessionId}`);
          // when another user sends an ICE Candidate, add it immediately or wiat for SDP process to complete
          await this.addRemoteIceCandidate(sessionId, message.candidate);
          break;
        case 'leave':
          console.log(`User ${sessionId} left room`);
          // when another user leaves, dispose their peer connection and video tag
          await this.closePeer(sessionId);
          break;
        default:
          console.warn(`Unrecognized method: ${message.action}`);
      }
    } catch (e) {
      console.warn('Error handling message');
      console.warn(e);
    }
  };

  // the sessionId is of the remote peer, and if the remoteSdpOffer is present, an SDP Answer is returned instead of an SDP Offer
  createPeer = async (sessionId, remoteSdpOffer) => {
    try {
      // instantiate the peer connection, making sure to configure STUN servers
      const webRtcPeer = new RTCPeerConnection({
        iceServers: [
          {
            url: 'stun:global.stun.twilio.com:3478?transport=udp',
            urls: 'stun:global.stun.twilio.com:3478?transport=udp',
          },
        ],
      });

      // send any gathered ICE Candidates to the other peer
      webRtcPeer.onicecandidate = (ev) => {
        this.sendMessage({
          action: 'trickle',
          room: this.state.joinedRoom,
          targetSessionId: sessionId,
          candidate: ev.candidate?.toJSON(),
        });
      };

      // listen for signaling state changes
      webRtcPeer.onsignalingstatechange = (ev) => {
        const connection = ev.target;
        console.log(`SignalingStateChange: ${connection.signalingState}`);
        // once the signaling state is stable, process any early ICE Candidates
        if (connection.signalingState === 'stable') {
          this.handleEarlyRemoteCandidates(webRtcPeer, sessionId);
        }
      };

      webRtcPeer.onaddstream = async ({ stream }) =>
        await this.addVideo(sessionId, stream);
      webRtcPeer.ontrack = async (ev) => {
        if (ev.track.kind === 'video') {
          await this.addVideo(sessionId, ev.streams[0]);
        }
      };

      // add the local stream (if available) so the remote peer can view it
      const localStream = this.state.streams.get(this.state.wsSessionId);
      if (localStream) {
        webRtcPeer.addStream(localStream);
      }

      let action;
      let jsep;
      if (remoteSdpOffer) {
        // if an SDP Offer was passed in, create an SDP Answer
        await webRtcPeer.setRemoteDescription(
          new RTCSessionDescription({ type: 'offer', sdp: remoteSdpOffer.sdp }),
        );
        jsep = await webRtcPeer.createAnswer();
        console.log(jsep);
        await webRtcPeer.setLocalDescription(jsep);
        action = 'sdpAnswer';
      } else {
        // otherwise create an SDP Offer
        jsep = await webRtcPeer.createOffer({
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1,
        });
        console.log(jsep);
        await webRtcPeer.setLocalDescription(jsep);
        action = 'sdpOffer';
      }
      // send either the SDP Offer or SDP Answer to the other peer
      this.sendMessage({
        room: this.state.joinedRoom,
        action,
        jsep,
        targetSessionId: sessionId,
      });
      // save the peer for access later (during the trickle process or for SDP Answer)
      const peers = this.state.peers.set(sessionId, webRtcPeer);
      await this.setState({
        peers: peers,
      });
    } catch (err) {
      console.log('Error sending SDP offer');
      console.error(err);
    }
  };

  addRemoteIceCandidate = async (sessionId, candidate) => {
    console.log('addRemoteIceCandidate');
    const remotePeer = this.state.peers.get(sessionId);
    if (remotePeer && candidate && remotePeer.signalingState === 'stable') {
      await remotePeer.addIceCandidate(candidate);
    } else {
      const earlyCandidates = this.state.earlyCandidates.has(sessionId)
        ? this.state.earlyCandidates.get(sessionId)
        : [];
      earlyCandidates.push(candidate);
      await this.setState({
        earlyCandidates: new Map(
          this.state.earlyCandidates.set(sessionId, earlyCandidates),
        ),
      });
    }
  };

  handleEarlyRemoteCandidates = async (webRtcPeer, sessionId) => {
    console.log('handleEarlyRemoteCandidates');
    const earlyCandidates = this.state.earlyCandidates.has(sessionId)
      ? this.state.earlyCandidates.get(sessionId)
      : [];
    for (const candidate of earlyCandidates) {
      if (candidate && webRtcPeer.connectionState !== 'closed') {
        await webRtcPeer.addIceCandidate(candidate);
      }
    }
    // stop storing the early ICE Candiates for that session
    const earlyCandidatesMap = this.state.earlyCandidates;
    earlyCandidatesMap.delete(sessionId);
    await this.setState({
      earlyCandidates: new Map(earlyCandidatesMap),
    });
  };
  closePeer = async (sessionId) => {
    console.log('closePeer');
    const peer = this.state.peers.get(sessionId);
    if (peer) {
      peer.close();
    }
    const peers = this.state.peers;
    peers.delete(sessionId);

    await this.setState({
      peers: new Map(peers),
    });
    await this.removeVideo(sessionId);
  };

  setupVideoDeviceList = async () => {
    const videoDevices = [...(await mediaDevices.enumerateDevices())].filter(
      (sourceInfo) =>
        sourceInfo.kind === 'videoinput' || sourceInfo.kind === 'video',
    );
    this.setState({ videoDevices });
  };

  // sets up the local media stream
  showLocalVideo = async ({ deviceId = undefined }) => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          // width: 640,
          // height: 480,
          // frameRate: 30,
          // facingMode: this.state.isFront ? 'user' : 'environment',
          deviceId,
        },
      });
      this.setState({ deviceId });
      await this.setupVideoDeviceList();
      await this.addVideo(this.state.wsSessionId, stream);
    } catch (err) {
      console.log('Error getting media permissions');
      console.warn(err);
      this.setState({ alertText: `${err}` });
    }
  };

  // releases local media stream's tracks and removes the video from the page
  releaseLocalVideo = async () => {
    await this.removeVideo(this.state.wsSessionId);
  };

  addVideo = async (sessionId, stream) => {
    await this.setState({
      streams: new Map(this.state.streams.set(sessionId, stream)),
    });
  };

  removeVideo = async (sessionId) => {
    const streams = this.state.streams;
    const stream = streams.get(sessionId);
    if (stream) {
      stream.release();
    }
    streams.delete(sessionId);
    await this.setState({ streams: new Map(streams) });
  };

  roomInputChange = (roomInput) => this.setState({ roomInput });

  render() {
    const isActiveStreamer = this.state.streams.has(this.state.wsSessionId);
    return (
      <View style={[styles.flex, styles.rootContainer]}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={[styles.flex, styles.rootContainer]}>
          <Text style={styles.label}>WebRTC Demo</Text>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={[styles.flex, styles.borderedContainer]}>
              <Text style={styles.label}>Video</Text>
              {this.state.alertText && (
                <TouchableOpacity onPress={this.connectWs}>
                  <Text style={styles.alertLabel}>{this.state.alertText}</Text>
                </TouchableOpacity>
              )}
              {[...this.state.streams.keys()].map((k) => (
                <View key={k} style={styles.flex}>
                  <RTCView
                    key={k}
                    stream={this.state.streams.get(k)}
                    objectFit="contain"
                    style={styles.flex}
                  />
                  <Text style={styles.streamLabel}>{k}</Text>
                </View>
              ))}
            </View>
            <View style={styles.shrinkingContainer}>
              <View>
                <Text style={styles.label}>
                  Room Name
                  {this.state.joinedRoom && `: ${this.state.joinedRoom}`}
                </Text>
                {!this.state.joinedRoom && (
                  <TextInput
                    onChangeText={this.roomInputChange}
                    placeholder={'Room Name'}
                    testID={'roomInput'}
                    // onSubmitEditing={this.joinOrLeaveRoom}
                    // returnKeyType={'join'}
                    value={this.state.roomInput}
                    style={styles.roomInput}
                  />
                )}
              </View>
            </View>
            <View style={styles.shrinkingContainer}>
              <View>
                <RoundedButton
                  text={this.state.joinedRoom ? 'Leave Room' : 'Join Room'}
                  onPress={this.joinOrLeaveRoom}
                  testID={
                    this.state.joinedRoom ? 'leaveRoomButton' : 'joinRoomButton'
                  }
                />
                {!this.state.joinedRoom && (
                  <>
                    <View style={styles.flexRow}>
                      <RoundedButton
                        style={styles.greenButton}
                        text={isActiveStreamer ? 'Revoke Media' : 'Grant Media'}
                        onPress={
                          isActiveStreamer
                            ? this.releaseLocalVideo
                            : this.showLocalVideo
                        }
                        testID={
                          isActiveStreamer
                            ? 'revokeMediaAccessRoomButton'
                            : 'grantMediaAccessRoomButton'
                        }
                      />
                    </View>
                    <View style={styles.flexRow}>
                      {this.state.videoDevices.map((device, index) => (
                        <RoundedButton
                          key={index}
                          onPress={() => this.showLocalVideo(device)}
                          style={styles.greenButton}
                          text={device.label || `Device ${index}`}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}
export default App;

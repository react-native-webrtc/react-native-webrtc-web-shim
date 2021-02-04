(window.waitAround = function (e) {
  return new Promise((t) => setTimeout(t, e));
}),
  (window.getStatsObject = function (e) {
    let t = [];
    if (void 0 !== e)
      for (let a = 0; a < e.length; a++) {
        let i = e[a];
        t[a] = [];
        for (let e = 0; e < i.length; e++) {
          t[a][e] = [];
          let s = {},
            n = i[e],
            o = 0,
            l = !1;
          for (o = 0; o < n.length; o++)
            'candidate-pair' === n[o].type &&
              ('succeeded' !== n[o].state ? (n.splice(o, 1), o--) : (l = !0));
          l && (o = 0);
          let r = !1;
          for (; o < n.length; ) {
            let i = n[o],
              l = i.type;
            'codec' === l && (r = !0),
              (filter.includes(l) || 'track' === l || 'candidate-pair' === l) &&
                ('track' === l
                  ? (s[i.id] = i)
                  : ('inbound-rtp' === l && r && !i.codecId) ||
                    t[a][e].push(i)),
              o++;
          }
          if (t[a][e].length > 0) {
            let i = {};
            (i.timestamp = t[a][e][0].timestamp), t[a][e].unshift(i);
            for (let i = 1; i < t[a][e].length; i++) {
              let n = t[a][e][i],
                o = n.trackId;
              if (void 0 !== o) {
                Object.keys(s).includes(o) &&
                  ((n.track = s[o]), delete s[o], (t[a][e][i] = n));
              }
            }
            for (let i = 1; i < t[a][e].length; i++) {
              let s = t[a][e][i];
              t[a][e][i] = getValuesFromObj(s);
            }
            let n = {},
              o = [];
            for (let i = 0; i < t[a][e].length; i++)
              o.push(Object.keys(t[a][e][i])[0]);
            for (let i = 0; i < t[a][e].length; i++)
              if (void 0 !== t[a][e][i][o[i]].kind) {
                let s = t[a][e][i][o[i]].kind;
                void 0 === n[Object.keys(t[a][e][i])[0] + '_' + s] &&
                  (n[Object.keys(t[a][e][i])[0] + '_' + s] = {});
                let l = t[a][e][i][o[i]].ssrc;
                n[Object.keys(t[a][e][i])[0] + '_' + s][l] = t[a][e][i][o[i]];
              } else n[Object.keys(t[a][e][i])[0]] = t[a][e][i][o[i]];
            t[a][e] = n;
          }
        }
        let s = 0;
        for (; s < t[a].length; )
          t[a][s] === {} || null === t[a][s] || 0 === t[a][s].length
            ? t[a].splice(s, 1)
            : s++;
      }
    return t;
  }),
  (window.getValueByName = function (e, t) {
    return void 0 !== e[t] ? e[t] : 'NA';
  }),
  (window.getValuesFromObj = function (e) {
    let t = {},
      a = {};
    switch (e.type) {
      case 'candidate-pair':
        (t.bytesReceived = getValueByName(e, 'bytesReceived')),
          (t.bytesSent = getValueByName(e, 'bytesSent')),
          (t.consentRequestsSent = getValueByName(e, 'consentRequestsSent')),
          (t.currentRoundTripTime = getValueByName(e, 'currentRoundTripTime')),
          (t.requestsReceived = getValueByName(e, 'requestsReceived')),
          (t.requestsSent = getValueByName(e, 'requestsSent')),
          (t.responsesReceived = getValueByName(e, 'responsesReceived')),
          (t.responsesSent = getValueByName(e, 'responsesSent')),
          (t.state = getValueByName(e, 'state'));
        break;
      case 'certificate':
      case 'codec':
        break;
      case 'inbound-rtp':
        if (
          ((t.ssrc = getValueByName(e, 'ssrc')),
          (t.bytesReceived = getValueByName(e, 'bytesReceived')),
          (t.kind = getValueByName(e, 'mediaType')),
          (t.packetsLost = getValueByName(e, 'packetsLost')),
          (t.packetsReceived = getValueByName(e, 'packetsReceived')),
          (t.lastPacketReceivedTimestamp = getValueByName(
            e,
            'lastPacketReceivedTimestamp',
          )),
          (t.fractionLost = getValueByName(e, 'fractionLost')),
          'audio' === e.mediaType
            ? (t.jitter = getValueByName(e, 'jitter'))
            : 'video' === e.mediaType &&
              ((t.firCount = getValueByName(e, 'firCount')),
              (t.framesDecoded = getValueByName(e, 'framesDecoded')),
              (t.nackCount = getValueByName(e, 'nackCount')),
              (t.pliCount = getValueByName(e, 'pliCount')),
              (t.qpSum = getValueByName(e, 'qpSum'))),
          void 0 !== e.track)
        ) {
          let a = e.track;
          (t.remoteSource = getValueByName(a, 'remoteSource')),
            'audio' === a.kind
              ? ((t.audioLevel = getValueByName(a, 'audioLevel')),
                (t.concealedSamples = getValueByName(a, 'concealedSamples')),
                (t.concealmentEvents = getValueByName(a, 'concealmentEvents')),
                (t.jitterBufferDelay = getValueByName(a, 'jitterBufferDelay')),
                (t.jitterBufferEmittedCount = getValueByName(
                  a,
                  'jitterBufferEmittedCount',
                )),
                (t.totalAudioEnergy = getValueByName(a, 'totalAudioEnergy')),
                (t.totalSamplesDuration = getValueByName(
                  a,
                  'totalSamplesDuration',
                )),
                (t.totalSamplesReceived = getValueByName(
                  a,
                  'totalSamplesReceived',
                )))
              : 'video' === a.kind &&
                ((t.frameHeight = getValueByName(a, 'frameHeight')),
                (t.frameWidth = getValueByName(a, 'frameWidth')),
                (t.framesDecoded = getValueByName(a, 'framesDecoded')),
                (t.framesDropped = getValueByName(a, 'framesDropped')),
                (t.framesReceived = getValueByName(a, 'framesReceived')));
        }
        break;
      case 'peer-connection':
      case 'remote-pair':
      case 'local-candidate':
        break;
      case 'outbound-rtp':
        if (
          ((t.ssrc = getValueByName(e, 'ssrc')),
          (t.bytesSent = getValueByName(e, 'bytesSent')),
          (t.isRemote = getValueByName(e, 'isRemote')),
          (t.kind = getValueByName(e, 'mediaType')),
          'audio' === e.mediaType
            ? ((t.packetsSent = getValueByName(e, 'packetsSent')),
              (t.retransmittedBytesSent = getValueByName(
                e,
                'retransmittedBytesSent',
              )),
              (t.retransmittedPacketsSent = getValueByName(
                e,
                'retransmittedPacketsSent',
              )))
            : 'video' === e.mediaType &&
              ((t.firCount = getValueByName(e, 'firCount')),
              (t.framesEncoded = getValueByName(e, 'framesEncoded')),
              (t.nackCount = getValueByName(e, 'nackCount')),
              (t.pliCount = getValueByName(e, 'pliCount')),
              (t.qpSum = getValueByName(e, 'qpSum')),
              (t.retransmittedBytesSent = getValueByName(
                e,
                'retransmittedBytesSent',
              )),
              (t.retransmittedPacketsSent = getValueByName(
                e,
                'retransmittedPacketsSent',
              )),
              (t.totalEncodeTime = getValueByName(e, 'totalEncodeTime'))),
          void 0 !== e.track)
        ) {
          let a = e.track;
          'audio' === a.kind
            ? ((t.audioLevel = getValueByName(a, 'audioLevel')),
              (t.totalAudioEnergy = getValueByName(a, 'totalAudioEnergy')),
              (t.totalSamplesDuration = getValueByName(
                a,
                'totalSamplesDuration',
              )))
            : 'video' === a.kind &&
              ((t.frameHeight = getValueByName(a, 'frameHeight')),
              (t.frameWidth = getValueByName(a, 'frameWidth')),
              (t.framesSent = getValueByName(a, 'framesSent')),
              (t.framesReceived = getValueByName(a, 'framesReceived')),
              (t.hugeFramesSent = getValueByName(a, 'hugeFramesSent')));
        }
    }
    return (a[e.type] = t), a;
  }),
  (window.addData = function (e, t, a, i) {
    e.data.datasets.push({
      fill: !1,
      label: t,
      backgroundColor: a,
      borderColor: a,
      data: i,
      lineTension: 0,
    });
  }),
  (window.getChartsConfigs = function (e, t) {
    let a = [];
    if (void 0 !== e) {
      let i = {};
      for (let s = 0; s < t.length; s++) {
        let n = t[s];
        switch (t[s]) {
          case 'receivedAudioBitrates':
            (i = getBitrates(e, 'audio', 'in')), (n += ' bit/s');
            break;
          case 'receivedVideoBitrates':
            (i = getBitrates(e, 'video', 'in')), (n += ' bit/s');
            break;
          case 'sentAudioBitrates':
            (i = getBitrates(e, 'audio', 'out')), (n += ' bit/s');
            break;
          case 'sentVideoBitrates':
            (i = getBitrates(e, 'video', 'out')), (n += ' bit/s');
            break;
          case 'audioPacketLoss':
            i = getPacketLoss(e, 'audio');
            break;
          case 'videoPacketLoss':
            i = getPacketLoss(e, 'video');
            break;
          case 'audioJitter':
            i = getAudioJitter(e);
            break;
          case 'videoFramesSent':
            i = getVideoFramesSent(e);
            break;
          case 'audioLevel':
            i = getAudioLevel(e);
            break;
          case 'framesReceivedRate':
            (i = getFramerates(e, 'in')), (n += ' frame/s');
            break;
          case 'framesSentRate':
            (i = getFramerates(e, 'out')), (n += ' frame/s');
        }
        let o = Object.keys(i);
        if (o.length > 0) {
          let e,
            t = 'second',
            s = Object.keys(i)[0];
          i[s][i[s].length - 1].x - i[s][0].x >= 36e5 && (t = 'minute'),
            (e = {
              type: 'line',
              data: { datasets: [] },
              options: {
                responsive: !1,
                title: { display: !0, text: n },
                scales: {
                  xAxes: [
                    {
                      type: 'time',
                      time: { unit: t },
                      bounds: 'ticks',
                      ticks: { source: 'auto', beginAtZero: !0 },
                    },
                  ],
                  yAxes: [{ type: 'linear', ticks: { beginAtZero: !0 } }],
                },
              },
            });
          for (let t = 0; t < o.length; t++) {
            let a = colors[t % colors.length],
              s = o[t].toString(),
              n = i[o[t]];
            addData(e, s, a, n);
          }
          a.push(e);
        }
      }
    }
    return a;
  }),
  (window.getBitrates = function (e, t, a) {
    let i = {};
    if (!(('audio' !== t && 'video' !== t) || ('in' !== a && 'out' !== a))) {
      let s = a + 'bound-rtp_' + t,
        n = 'in' === a ? 'bytesReceived' : 'out' === a ? 'bytesSent' : '';
      for (let t = 0; t < e.length; t++)
        if (void 0 !== e[t][0] && null !== e[t][0]) {
          let a = Object.keys(e[t][0]);
          if (a.includes(s) && a.includes('timestamp'))
            for (let a = 0; a < e[t].length - 1; a++) {
              let o = parseInt(e[t][a + 1].timestamp),
                l = o - parseInt(e[t][a].timestamp),
                r = e[t][a][s],
                u = e[t][a + 1][s];
              for (let e in u) {
                let t = computeBitrate(r[e], u[e], n, l);
                if (void 0 !== t) {
                  void 0 === i[e] && (i[e] = []);
                  let a = { x: o, y: t };
                  i[e].push(a);
                }
              }
            }
        }
    }
    return i;
  }),
  (window.computeBitrate = function (e, t, a, i) {
    let s;
    if ('NA' !== e[a] && 'NA' !== t[a]) {
      let n = parseInt(e[a]),
        o = parseInt(t[a]);
      s = n !== o && 0 != i ? Math.abs((8e3 * (o - n)) / i).toFixed(2) : 0;
    }
    return s;
  }),
  (window.getPacketLoss = function (e, t) {
    let a = {};
    if ('video' === t || 'audio' === t) {
      let i = 'inbound-rtp_' + t;
      for (let t = 0; t < e.length; t++)
        if (void 0 !== e[t][0] && null !== e[t][0]) {
          let s = Object.keys(e[t][0]);
          if (s.includes(i) && s.includes('timestamp'))
            for (let s = 0; s < e[t].length - 1; s++) {
              let n = parseInt(e[t][s + 1].timestamp),
                o = e[t][s][i],
                l = e[t][s + 1][i];
              for (let e in l) {
                let t = computePacketsLoss(o[e], l[e]);
                if (void 0 !== t) {
                  void 0 === a[e] && (a[e] = []);
                  let i = { x: n, y: t };
                  a[e].push(i);
                }
              }
            }
        }
    }
    return a;
  }),
  (window.computePacketsLoss = function (e, t) {
    let a;
    if (void 0 !== e && void 0 !== t) {
      let i = e.packetsLost,
        s = t.packetsLost,
        n = e.packetsReceived,
        o = t.packetsReceived;
      if ('NA' !== i && 'NA' !== s && 'NA' !== n && 'NA' !== o) {
        let e = parseInt(i) + parseInt(n),
          t = parseInt(s) + parseInt(o);
        t - e > 0 &&
          (a = (a = (100 * (parseInt(s) - parseInt(i))) / (t - e)).toFixed(2));
      }
    }
    return a;
  }),
  (window.getAudioJitter = function (e) {
    let t = {},
      a = 'inbound-rtp_audio';
    for (let i = 0; i < e.length; i++)
      if (void 0 !== e[i][0] && null !== e[i][0]) {
        let s = Object.keys(e[i][0]);
        if (s.includes(a) && s.includes('timestamp'))
          for (let s = 0; s < e[i].length; s++) {
            let n = parseInt(e[i][s].timestamp),
              o = e[i][s][a];
            for (let e in o)
              if ('NA' !== o[e].jitter) {
                let a = 1e3 * parseFloat(o[e].jitter);
                void 0 === t[e] && (t[e] = []);
                let i = { x: n, y: a };
                t[e].push(i);
              }
          }
      }
    return t;
  }),
  (window.getAudioLevel = function (e) {
    let t = {},
      a = 'inbound-rtp_audio';
    for (let i = 0; i < e.length; i++)
      if (void 0 !== e[i][0] && null !== e[i][0]) {
        let s = Object.keys(e[i][0]);
        if (s.includes(a) && s.includes('timestamp'))
          for (let s = 0; s < e[i].length; s++) {
            let n = parseInt(e[i][s].timestamp),
              o = e[i][s][a];
            for (let e in o)
              if (void 0 !== o[e].audioLevel && 'NA' !== o[e].audioLevel) {
                let a = 100 * parseFloat(o[e].audioLevel);
                void 0 === t[e] && (t[e] = []);
                let i = { x: n, y: a };
                t[e].push(i);
              }
          }
      }
    return t;
  }),
  (window.getVideoFramesSent = function (e) {
    let t = {},
      a = 'outbound-rtp_video';
    for (let i = 0; i < e.length; i++)
      if (void 0 !== e[i][0] && null !== e[i][0]) {
        let s = Object.keys(e[i][0]);
        if (s.includes(a) && s.includes('timestamp'))
          for (let s = 0; s < e[i].length; s++) {
            let n = parseInt(e[i][s].timestamp),
              o = e[i][s][a];
            for (let e in o)
              if (void 0 !== o[e].framesSent && 'NA' !== o[e].framesSent) {
                let a = 100 * parseFloat(o[e].framesSent);
                void 0 === t[e] && (t[e] = []);
                let i = { x: n, y: a };
                t[e].push(i);
              }
          }
      }
    return t;
  }),
  (window.getFramerates = function (e, t) {
    let a = {},
      i = 'frames' + ('in' === t ? 'Received' : 'out' === t ? 'Sent' : ''),
      s = t + 'bound-rtp_video';
    for (let t = 0; t < e.length; t++)
      if (void 0 !== e[t][0] && null !== e[t][0]) {
        let n = Object.keys(e[t][0]);
        if (n.includes(s) && n.includes('timestamp'))
          for (let n = 0; n < e[t].length - 1; n++) {
            let o = parseInt(e[t][n + 1].timestamp),
              l = o - parseInt(e[t][n].timestamp),
              r = e[t][n][s],
              u = e[t][n + 1][s];
            for (let e in u) {
              let t = computeFrameRate(r[e], u[e], i, l);
              if (void 0 !== t) {
                void 0 === a[e] && (a[e] = []);
                let i = { x: o, y: t };
                a[e].push(i);
              }
            }
          }
      }
    return a;
  }),
  (window.computeFrameRate = function (e, t, a, i) {
    let s;
    if ('NA' !== e[a] && void 0 !== e[a] && void 0 !== t[a] && 'NA' !== t[a]) {
      let n = e[a],
        o = t[a];
      n !== o ? 0 !== i && (s = ((1e3 * (o - n)) / i).toFixed(2)) : (s = 0);
    }
    return s;
  });

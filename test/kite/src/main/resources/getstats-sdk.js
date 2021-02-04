function GetStats() {
  this.receiverUrl = '';
  this.userId = '';
  this.roomId = '';
  this.sfu = '';
  this.pcObject = null;
  this.alwaysSendEverything = true;
  this.lastStatsObjValues = {};
  this.publishing = null;
  this.testName = '';
  this.testId = '';
}

GetStats.prototype.init = function (
  receiverUrl,
  userId,
  roomId,
  sfu,
  pcObject,
  testName,
  testId,
  alwaysSendEverything = true,
) {
  this.receiverUrl = receiverUrl;
  this.userId = userId;
  this.roomId = roomId;
  this.sfu = sfu;
  this.pcObject = pcObject;
  this.testName = testName;
  this.testId = testId;
  this.alwaysSendEverything = alwaysSendEverything;
};

GetStats.prototype.startPublishing = function (interval) {
  let publishingFunction = function () {
    this.getStatsValues()
      .then((statsObj) => this.publish(statsObj))
      .then((resp) => console.log(resp))
      .catch((err) => console.log('Error in publishing getStats data: ', err));
  };

  this.publishing = setInterval(publishingFunction.bind(this), interval);
};

GetStats.prototype.stopPublishing = function () {
  clearInterval(this.publishing);
};

GetStats.prototype.getStatsValues = async function () {
  return this.pcObject
    .getStats()
    .then((data) => {
      let statsObj = {};
      compareValueOf = this.compareValueOf.bind(this);
      data.forEach((res) => {
        if (!this.alwaysSendEverything) {
          const newValue = this.compareValueOf(res);
          if (newValue) statsObj[res.id] = res;
        } else {
          if (res.type == 'candidate-pair') {
            this.localid = res.localCandidateId;
            this.remoteid = res.remoteCandidateId;
          }
          if (res.type != 'certificate') {
            if (res.type == 'inbound-rtp' && !res.codecId) {
            } else {
              statsObj[res.id] = res;
            }
          }
        }
      });
      return statsObj;
    })
    .catch();
};

GetStats.prototype.compareValueOf = function (item) {
  compareItem = cloneObject(item);
  delete compareItem.timestamp;
  if (
    compareItem.type != 'local-candidate' &&
    compareItem.type != 'remote-candidate'
  ) {
    if (
      JSON.stringify(compareItem) ===
      JSON.stringify(this.lastStatsObjValues[compareItem.id])
    ) {
      return false;
    }
  }
  this.lastStatsObjValues[compareItem.id] = cloneObject(compareItem);
  return true;
};

function cloneObject(obj) {
  var clone = {};
  for (var i in obj) {
    if (obj[i] != null && typeof obj[i] == 'object')
      clone[i] = cloneObject(obj[i]);
    else clone[i] = obj[i];
  }
  return clone;
}

GetStats.prototype.publish = function (statsObj) {
  body = {
    userId: this.userId,
    roomId: this.roomId,
    sfu: this.sfu,
    testName: this.testName,
    testId: this.testId,
    stats: statsObj,
  };

  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.receiverUrl);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send(JSON.stringify(body));
  });
};

var username = 'user';
var myroom = 'room';

function sendStats(pc, testName, testId) {
  window.testStats = new GetStats();
  testStats.init(
    '//logstash.worsh.tv:5000',
    username,
    myroom,
    'Janus',
    pc,
    testName,
    testId,
  );
  console.log(pc);
  testStats.startPublishing(15000);
  console.log('SendStats started');
}

console.log(
  'getstats SDK loaded: username = ' + username + ', myroom = ' + myroom,
);
setTimeout(function () {
  if (window.pc) {
    sendStats(window.pc, KITETestName, KITETestId);
  }
  if (window.remotePc) {
    sendStats(window.remotePc[0], KITETestName, KITETestId);
  }
}, 2000);

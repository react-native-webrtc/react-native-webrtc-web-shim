package com.ruddell.kite;

import com.ruddell.kite.pages.RnWebRtcWebShimPage;
import com.ruddell.kite.steps.*;
import com.ruddell.kite.checks.StreamingVideoCheck;
import io.cosmosoftware.kite.steps.*;
import org.webrtc.kite.tests.KiteBaseTest;
import org.webrtc.kite.tests.TestRunner;

import javax.json.JsonObject;

import static org.webrtc.kite.Utils.getStackTrace;

public class RnWebRtcWebShimTest extends KiteBaseTest {

  protected boolean sfu = false;
  private String url = null;
  private JsonObject getChartsConfig = null;
  private boolean allureCharts = false;
  private String streamGuid;

  @Override
  protected void payloadHandling() {
    super.payloadHandling();
    if (this.payload != null) {
      this.sfu = payload.getBoolean("sfu", false);
      this.url = payload.getString("url", "http://localhost:5000");
      this.streamGuid = payload.getString("streamGuid", "Bgfu14m");
      this.getChartsConfig = this.payload.getJsonObject("getCharts");
      this.allureCharts = this.getChartsConfig != null && this.getChartsConfig.getBoolean("enabled");
    }
  }

  @Override
  protected void populateTestSteps(TestRunner runner) {
    try {
      final RnWebRtcWebShimPage rnWebRtcWebShimPage = new RnWebRtcWebShimPage(runner);
      Boolean isBroadcaster = runner.getId() % roomManager.getMaxCapacity() == 0;
      runner.addStep(new StartDemoStep(runner, url, streamGuid));
      // synchronizes all tests to ensure they are all receiving video before continuing
      runner.addStep(new WaitForOthersStep(runner, this, runner.getLastStep()));
      // resize window
      runner.addStep(new CustomResizeWindowStep(runner));

      // starts broadcasting and viewing
      runner.addStep(new JoinRoomStep(runner, isBroadcaster, streamGuid));
      // checks videos
      runner.addStep(new StreamingVideoCheck(runner));

//      // disabling, we get the stats in the Charts step as well
//      if (this.getStats()) {
//        runner.addStep(new GetStatsStep(runner, getStatsConfig, sfu, rnWebRtcWebShimPage));
//      }

      if (this.allureCharts) {
        runner.addStep(new StartGetStatsStep(runner, getChartsConfig));
      }

      if (this.takeScreenshotForEachTest()) {
        runner.addStep(new CustomScreenshotStep(runner, isBroadcaster));
      }

//      // disabling, we wait for the Charts step as well
//      if (this.meetingDuration > 0) {
//        runner.addStep(new StayInMeetingStep(runner, meetingDuration));
//      }

      if (this.allureCharts) {
        runner.addStep(new StopGetStatsStep(runner));
        runner.addStep(new GenerateChartsStep(runner, getChartsConfig, getTestJar()));
      }
      // synchronizes all tests to ensure they all stop at same time
      runner.addStep(new WaitForOthersStep(runner, this, runner.getLastStep()));

      // leave the test, stop broadcasting or viewing
      runner.addStep(new LeaveRoomStep(runner, isBroadcaster));

    } catch(Exception e){
      logger.error(getStackTrace(e));
    }
  }


}

package com.ruddell.kite.steps;

import com.ruddell.kite.pages.RnWebRtcWebShimPage;
import io.cosmosoftware.kite.exception.KiteTestException;
import org.webrtc.kite.tests.TestRunner;
import io.cosmosoftware.kite.steps.TestStep;

import static io.cosmosoftware.kite.entities.Timeouts.ONE_SECOND_INTERVAL;
import static io.cosmosoftware.kite.entities.Timeouts.TEN_SECOND_INTERVAL;
import static io.cosmosoftware.kite.util.TestUtils.executeJsScript;
import static io.cosmosoftware.kite.util.TestUtils.waitAround;

public class JoinRoomStep extends TestStep {

  private final RnWebRtcWebShimPage rnWebRtcWebShimPage;
  private final boolean isBroadcaster;
  private final String streamGuid;

  public JoinRoomStep(TestRunner runner, Boolean isBroadcaster, String streamGuid) {
    super(runner);
    this.rnWebRtcWebShimPage = new RnWebRtcWebShimPage(runner);
    this.isBroadcaster = isBroadcaster;
    this.streamGuid = streamGuid;
  }

  @Override
  protected void step() throws KiteTestException {
    executeJsScript(webDriver,"window.scrollTo(0, document.body.scrollHeight)");
    waitAround(ONE_SECOND_INTERVAL);
    logger.info("✅ Joining Room...");
    if (isBroadcaster) {
      rnWebRtcWebShimPage.grantMediaAccess();
    }
    rnWebRtcWebShimPage.joinRoom(streamGuid);
    logger.info("✅ Joined Room!");
    }

  @Override
  public String stepDescription() {
    return "Joining the Demo Room and granting media access.";
  }
}

package com.ruddell.kite.steps;

import com.ruddell.kite.pages.RnWebRtcWebShimPage;
import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.interfaces.Runner;
import io.cosmosoftware.kite.steps.TestStep;

import static io.cosmosoftware.kite.entities.Timeouts.THREE_SECOND_INTERVAL;
import static io.cosmosoftware.kite.util.TestUtils.waitAround;

public class LeaveRoomStep extends TestStep {


  private final RnWebRtcWebShimPage rnWebRtcWebShimPage;
  private final Boolean isBroadcaster;

  public LeaveRoomStep(Runner runner, Boolean isBroadcaster) {
    super(runner);
    this.isBroadcaster = isBroadcaster;
    this.rnWebRtcWebShimPage = new RnWebRtcWebShimPage(runner);
  }

  @Override
  protected void step() throws KiteTestException {
    rnWebRtcWebShimPage.leaveRoom();
    if (isBroadcaster) {
      rnWebRtcWebShimPage.revokeMediaAccess();
    }
    waitAround(THREE_SECOND_INTERVAL);
  }

  @Override
  public String stepDescription() {
    return "Leaving the Demo Room and revoking media access.";
  }
}

package com.ruddell.kite.steps;

import com.ruddell.kite.pages.RnWebRtcWebShimPage;
import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.steps.TestStep;
import org.webrtc.kite.tests.TestRunner;

import static io.cosmosoftware.kite.entities.Timeouts.TEN_SECOND_INTERVAL_IN_SECONDS;
import static io.cosmosoftware.kite.util.WebDriverUtils.loadPage;

public class StartDemoStep extends TestStep {

  private final String url;
  private final RnWebRtcWebShimPage rnWebRtcWebShimPage;


  public StartDemoStep(TestRunner runner, String url, String streamGuid) {
    super(runner);
    this.rnWebRtcWebShimPage = new RnWebRtcWebShimPage(runner);
    this.url = url;
  }

  @Override
  public String stepDescription() {
    return "Open " + url + " and wait for the page to load.";
  }

  @Override
  protected void step() throws KiteTestException {
    loadPage(this.webDriver, url, TEN_SECOND_INTERVAL_IN_SECONDS);
    logger.info("Page " + url + " loaded.");
    rnWebRtcWebShimPage.waitUntilViewPageLoaded(10000);
    logger.info("✅ Page Loaded, Waiting for Others");
  }
}

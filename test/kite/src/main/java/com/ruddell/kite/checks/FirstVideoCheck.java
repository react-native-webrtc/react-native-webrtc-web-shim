package com.ruddell.kite.checks;

import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.interfaces.Runner;
import io.cosmosoftware.kite.report.Status;
import org.openqa.selenium.WebElement;

import java.util.List;

import static io.cosmosoftware.kite.util.TestUtils.videoCheck;


public class FirstVideoCheck extends VideoCheckBase {


  public FirstVideoCheck(Runner runner) {
    super(runner);
  }

  @Override
  public String stepDescription() {
    return "Check the first video is being sent OK";
  }

  @Override
  protected void step() throws KiteTestException {
    try {
      logger.info("Looking for video object");
      rnWebRtcWebShimPage.waitUntilVisibilityOfFirstVideo(10);
      List<WebElement> videos = rnWebRtcWebShimPage.getVideoElements();

      if (videos.isEmpty()) {
        throw new KiteTestException(
            "Unable to find any <video> element on the page", Status.FAILED);
      }
      String firstVideoId = rnWebRtcWebShimPage.getVideoIdByIndex(0);
      if (!firstVideoId.equalsIgnoreCase("myvideo")){
        logger.info("the first video is not local user's video");
      }
      String videoCheck = videoCheck(webDriver, 0);

      if (!"video".equalsIgnoreCase(videoCheck)) {
        reporter.textAttachment(report, "Sent Video", videoCheck, "plain");
        throw new KiteTestException("The first video is " + videoCheck, Status.FAILED);
      }
    } catch (Exception e) {
      throw new KiteTestException("Error looking for the video", Status.BROKEN, e);
    }
  }
}

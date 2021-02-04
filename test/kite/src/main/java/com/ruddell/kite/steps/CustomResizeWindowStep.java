package com.ruddell.kite.steps;

import com.ruddell.kite.pages.RnWebRtcWebShimPage;
import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.steps.TestStep;
import org.openqa.selenium.*;
import org.webrtc.kite.tests.TestRunner;

public class CustomResizeWindowStep extends TestStep {
  private final RnWebRtcWebShimPage rnWebRtcWebShimPage;
  private final int id;
  private int windowWidth;
  private int windowHeight;

  public CustomResizeWindowStep(TestRunner runner) {
    super(runner);
    this.id = runner.getId();
    this.rnWebRtcWebShimPage = new RnWebRtcWebShimPage(runner);
  }


  @Override
  protected void step() throws KiteTestException {
    webDriver.manage().window().maximize();
    Dimension currentSize = webDriver.manage().window().getSize();
    windowWidth = currentSize.getWidth();
    windowHeight = currentSize.getHeight();
    int width = windowWidth / 2;
    int height = windowHeight;
    int x = getX(id);
    int y = getY(id);
    webDriver.manage().window().setSize(new Dimension(width, height));
    webDriver.manage().window().setPosition(new Point(x, y));
  }


  private final int NO_WINDOWS_HORIZONTAL = 2;

  private int getX(int id) {
    return (id % NO_WINDOWS_HORIZONTAL ) * this.windowWidth/2;
  }

  private int getY(int id) {
    return ((id - (id % NO_WINDOWS_HORIZONTAL)) / NO_WINDOWS_HORIZONTAL) * this.windowHeight/2;
  }

  @Override
  public String stepDescription() {
    return "Resizing Window";
  }
}

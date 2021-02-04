/*
 * Copyright (C) CoSMo Software Consulting Pte. Ltd. - All Rights Reserved
 */

package com.ruddell.kite;

import junit.framework.TestCase;
import org.openqa.selenium.WebDriver;
import org.webrtc.kite.config.test.Tuple;
import org.webrtc.kite.tests.KiteBaseTest;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.webrtc.kite.Utils.getFirstTuple;
import static org.webrtc.kite.Utils.getPayload;

public class RnWebRtcWebShimTestTest extends TestCase {

  static {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HHmmss");
    System.setProperty("current.date", dateFormat.format(new Date()));
  }

  private static final String TEST_NAME = "React Native WebRtc Web Shim UnitTest";
  private static final String CONFIG_FILE = "configs/all.config.json";

  private List<WebDriver> webDriverList = new ArrayList<>();
  private Tuple tuple = getFirstTuple(CONFIG_FILE);

  public void setUp() throws Exception {
    super.setUp();
  }

  public void tearDown()  {
    for (WebDriver webDriver : this.webDriverList)
      try {
        webDriver.quit();
      } catch (Exception e) {
        e.printStackTrace();
      }
  }

  public void testTestScript() {
    KiteBaseTest test = new RnWebRtcWebShimTest();
    test.setDescription(TEST_NAME);
    test.setPayload(getPayload(CONFIG_FILE, 0));
    test.setTuple(tuple);
    Object testResult = test.execute();
  }
}

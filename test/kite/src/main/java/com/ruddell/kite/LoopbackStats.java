package com.ruddell.kite;

import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.report.KiteLogger;
import io.cosmosoftware.kite.report.Status;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

public class LoopbackStats {

  private final String sentWidth;
  private final String sentHeight;
  private final String sentFPS;
  private final String sentBW;
  private final String recvWidth;
  private final String recvHeight;
  private final String recvFPS;
  private final String recvBW;

  public LoopbackStats(String sentWidth, String sentHeight, String sentFPS, String sentBW,
                       String recvWidth, String recvHeight, String recvFPS, String recvBW) {
    this.sentWidth = sentWidth;
    this.sentHeight = sentHeight;
    this.sentFPS = sentFPS;
    this.sentBW = sentBW;
    this.recvWidth = recvWidth;
    this.recvHeight = recvHeight;
    this.recvFPS = recvFPS;
    this.recvBW = recvBW;
  }

  public JsonObject getJson() {
    JsonObjectBuilder jsonObjectBuilder = Json.createObjectBuilder();
    jsonObjectBuilder.add("sentWidth", sentWidth);
    jsonObjectBuilder.add("sentHeight", sentHeight);
    jsonObjectBuilder.add("sentFPS", sentFPS);
    jsonObjectBuilder.add("sentBW", sentBW);
    jsonObjectBuilder.add("recvWidth", recvWidth);
    jsonObjectBuilder.add("recvHeight", recvHeight);
    jsonObjectBuilder.add("recvFPS", recvFPS);
    jsonObjectBuilder.add("recvBW", recvBW);
    return jsonObjectBuilder.build();
  }

  public void validate(String rid, KiteLogger logger) throws KiteTestException {
    int factor = "a".equalsIgnoreCase(rid) ? 1 : "b".equalsIgnoreCase(rid) ? 2 : 4;
    int expectedWidth = Integer.parseInt(sentWidth.trim())/factor;
    int expectedHeight = Integer.parseInt(sentHeight.trim())/factor;
    if (Integer.parseInt(recvWidth.trim()) != expectedWidth
      || Integer.parseInt(recvHeight.trim()) != expectedHeight) {
      logger.info("Validation failed for profile " + rid + ". Expected ("
        + expectedWidth + "," + expectedHeight + ") Actual (" + recvWidth + "," + recvHeight + ")");
      throw new KiteTestException("Stats check failed. Expected ("
        + expectedWidth + "," + expectedHeight + ") Actual (" + recvWidth + "," + recvHeight + ")", Status.FAILED, null, true);
    }
    logger.info("Validation successful for profile " + rid + ". Expected ("
      + expectedWidth + "," + expectedHeight + ") Actual (" + recvWidth + "," + recvHeight + ")");
  }

}

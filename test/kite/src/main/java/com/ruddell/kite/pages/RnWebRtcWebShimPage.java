package com.ruddell.kite.pages;

import io.cosmosoftware.kite.exception.KiteInteractionException;
import io.cosmosoftware.kite.interfaces.Runner;
import io.cosmosoftware.kite.pages.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.ArrayList;
import java.util.List;

import static io.cosmosoftware.kite.entities.Timeouts.ONE_SECOND_INTERVAL;
import static io.cosmosoftware.kite.entities.Timeouts.TEN_SECOND_INTERVAL_IN_SECONDS;
import static io.cosmosoftware.kite.util.TestUtils.waitAround;

public class RnWebRtcWebShimPage extends BasePage {

  @FindBy(xpath = "//*[@data-testid=\"joinRoomButton\"]")
  private WebElement joinRoomButton;

  @FindBy(xpath = "//*[@data-testid=\"leaveRoomButton\"]")
  private WebElement leaveRoomButton;

  @FindBy(xpath = "//*[@data-testid=\"grantMediaAccessRoomButton\"]")
  private WebElement grantMediaAccessRoomButton;

  @FindBy(xpath = "//*[@data-testid=\"revokeMediaAccessRoomButton\"]")
  private WebElement revokeMediaAccessRoomButton;

  @FindBy(xpath = "//*[@data-testid=\"roomInput\"]")
  private WebElement roomInput;

  @FindBy(tagName = "video")
  private List<WebElement> videos;

  public RnWebRtcWebShimPage(Runner runner) {
    super(runner);
  }

  public List<String> getRemotePC() {
    List<String> peerConnectionsList = new ArrayList<String>();
    peerConnectionsList.add("window.component.state.peers[0]");
    return peerConnectionsList;
  }

  /** @return the list of video elements */
  public List<WebElement> getVideoElements() {
    return videos;
  }

  public void waitUntilVisibilityOfFirstVideo(int timeoutInSeconds)
      throws KiteInteractionException {
    By locator = By.tagName("video");
    waitUntilVisibilityOf(locator, timeoutInSeconds);
  }

  public String getVideoIdByIndex(int i) {
    return videos.get(i).getAttribute("id");
  }

  public void grantMediaAccess() throws KiteInteractionException {
    click(grantMediaAccessRoomButton);
    waitAround(ONE_SECOND_INTERVAL);
  }
  public void revokeMediaAccess() throws KiteInteractionException {
    click(revokeMediaAccessRoomButton);
    waitAround(ONE_SECOND_INTERVAL);
  }
  public void joinRoom(String streamGuid) throws KiteInteractionException {
    enterGuid(streamGuid);
    click(joinRoomButton);
    waitAround(ONE_SECOND_INTERVAL);
  }
  public void leaveRoom() throws KiteInteractionException {
    click(leaveRoomButton);
    waitAround(ONE_SECOND_INTERVAL);
  }

  // safari fails to click on buttons for some reason, workaround is to click through JS
  public void click(WebElement element) throws KiteInteractionException {
    ((JavascriptExecutor)webDriver).executeScript("arguments[0].click();", element);
  }

  public void waitUntilViewPageLoaded(int timeoutInSeconds) throws KiteInteractionException {
    waitUntilVisibilityOf(joinRoomButton, timeoutInSeconds);
  }

  public void enterGuid(String streamGuid) throws KiteInteractionException {
    waitUntilVisibilityOf(roomInput, TEN_SECOND_INTERVAL_IN_SECONDS);
    sendKeys(roomInput, streamGuid);
    waitAround(ONE_SECOND_INTERVAL);
  }
}

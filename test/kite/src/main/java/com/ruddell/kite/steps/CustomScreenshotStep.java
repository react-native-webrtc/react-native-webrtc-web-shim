package com.ruddell.kite.steps;

import io.cosmosoftware.kite.steps.ScreenshotStep;
import org.webrtc.kite.tests.TestRunner;

public class CustomScreenshotStep extends ScreenshotStep {
    private final Boolean isBroadcaster;

    public CustomScreenshotStep(TestRunner runner, Boolean isBroadcaster) {
        super(runner);
        this.isBroadcaster = isBroadcaster;
    }

    public String stepDescription() {
        return "Get a screenshot for the " + (isBroadcaster ? "Broadcaster" : "Viewer");
    }

}

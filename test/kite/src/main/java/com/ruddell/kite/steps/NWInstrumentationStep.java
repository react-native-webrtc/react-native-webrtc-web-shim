package com.ruddell.kite.steps;

import io.cosmosoftware.kite.exception.KiteTestException;
import io.cosmosoftware.kite.instrumentation.Scenario;
import io.cosmosoftware.kite.interfaces.Runner;
import io.cosmosoftware.kite.report.Status;
import io.cosmosoftware.kite.steps.TestStep;

import static io.cosmosoftware.kite.util.ReportUtils.getStackTrace;
import static io.cosmosoftware.kite.util.TestUtils.waitAround;

public class NWInstrumentationStep extends TestStep {

  private final Scenario scenario;
  private final int clientId;

  public NWInstrumentationStep(Runner runner, Scenario scenario, int clientId) {
    super(runner);
    this.scenario = scenario;
    this.clientId = clientId;
    this.setName(getName() + "_" + scenario.getName());
  }

  @Override
  public String stepDescription() {
    return "Network Instrumentation for " + scenario.getName();
  }

  @Override
  protected void step() throws KiteTestException {
      try {
        StringBuilder text = new StringBuilder();
        String command = scenario.getCommand();
        text.append("Executing command ").append(command).append("on ").append(scenario.getType());
        reporter.textAttachment(report, "Commands for scenario " + scenario.getName(), text.toString(), "plain");
        waitAround(1000);
        if (this.scenario.shouldExecute(this.clientId)) {
          String result = this.scenario.sendCommand(webDriver);
          reporter.textAttachment(report, "Result", result, "plain");
          if (result.contains("FAILED") || result.contains("ERROR")) {
            throw new KiteTestException("Failed to execute command.", Status.FAILED);
          }
        }
        logger.info("Now waiting around " + scenario.getDuration()/1000 + "s.");
        waitAround(this.scenario.getDuration());
        if (this.scenario.shouldExecute(this.clientId)) {
          String result = this.scenario.cleanUp(webDriver);
          logger.info("Cleaning up scenario for " + this.scenario.getName());
          reporter.textAttachment(report, "NW Instrumentation CleanUp for " + scenario.getName(), "Commands executed : " + result, "plain");
          if (result.contains("FAILED") || result.contains("ERROR")) {
            throw new KiteTestException("Failed to clean up.", Status.FAILED);
          }
        }
        waitAround(1000);
        logger.info("cleanUp() done.");
        logger.info("Waiting 5 seconds before going in the next scenario");
        waitAround(5000);
      } catch (Exception e) {
        logger.error(getStackTrace(e));
        throw new KiteTestException("Failed to execute command ", Status.BROKEN, e);
    }
  }

}

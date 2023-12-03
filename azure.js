const { DefaultAzureCredential } = require("@azure/identity");
const { LogsIngestionClient, isAggregateLogsUploadError } = require("@azure/monitor-ingestion");

require("dotenv").config();

async function main() {
  const logsIngestionEndpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com";
  const ruleId = "dcr-00000000000000000000000000000000";
  const streamName = "Custom-MyTableRawData";
  const credential = new DefaultAzureCredential();
  const client = new LogsIngestionClient(logsIngestionEndpoint, credential);
  const logs = [
    {
      Time: "2021-12-08T23:51:14.1104269Z",
      Computer: "Computer1",
      AdditionalContext: {
          "InstanceName": "user1",
          "TimeZone": "Pacific Time",
          "Level": 4,
          "CounterName": "AppMetric2",
          "CounterValue": 35.3    
      }
    },
    {
      Time: "2021-12-08T23:51:14.1104269Z",
      Computer: "Computer2",
      AdditionalContext: {
          "InstanceName": "user2",
          "TimeZone": "Pacific Time",
          "Level": 4,
          "CounterName": "AppMetric2",
          "CounterValue": 43.5    
      }
    },
  ];
  try{
    await client.upload(ruleId, streamName, logs);
  }
  catch(e){
    let aggregateErrors = isAggregateLogsUploadError(e) ? e.errors : [];
    if (aggregateErrors.length > 0) {
      console.log("Some logs have failed to complete ingestion");
      for (const error of aggregateErrors) {
        console.log(`Error - ${JSON.stringify(error.cause)}`);
        console.log(`Log - ${JSON.stringify(error.failedLogs)}`);
      }
    } else {
      console.log(e);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
  process.exit(1);
});
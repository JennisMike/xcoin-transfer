const {
  ClosingError,
  GlideClusterClient,
  Logger,
} = require("@valkey/valkey-glide");

async function main() {
  // Set logger configuration
  Logger.setLoggerConfig("info");
  console.log("Connecting to Valkey Glide...");

  let client = null;

  try {
    // Create a standalone client using environment variables
    const host =
      process.env.VALKEY_HOST ||
      "https://xcoin-transfer-gwatqz.serverless.use1.cache.amazonaws.com";
    const port = Number(process.env.VALKEY_PORT) || 6379;

    client = await GlideClusterClient.createClient({
      addresses: [{ host, port }],
      useTLS: true,
    });

    console.log("Connected successfully.");

    // Perform SET operation
    await client.set("foo", "bar");
    console.log('Set key "foo" to "bar".');

    // Perform GET operation
    const value = await client.get("foo");
    console.log(`Get response for "foo": ${value?.toString()}`);

    // Perform PING operation
    const pong = await client.ping();
    console.log(`PING response: ${pong}`);
  } catch (error) {
    console.error("An exception occurred:", error);
  } finally {
    // Close the client connection
    if (client) {
      try {
        await client.close();
        console.log("Client connection closed.");
      } catch (error) {
        if (error instanceof ClosingError) {
          console.error(`Error closing client: ${error.message}`);
        } else {
          console.error("Unexpected error during client closure:", error);
        }
      }
    }
  }
}

main();

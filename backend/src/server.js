const app = require("./app");
const env = require("./config/env");
const { connectMongo, useMongo } = require("./config/db");

async function start() {
  if (useMongo) {
    await connectMongo();
    console.log("Connected to MongoDB");
  }

  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

start();

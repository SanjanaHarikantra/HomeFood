const { MongoClient } = require("mongodb");
const env = require("./env");

const client = new MongoClient(env.mongodb.uri, {
  serverApi: { version: "1" },
});

let connectedClient = null;

function generateId() {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`);
}

async function connect() {
  if (!connectedClient) {
    connectedClient = await client.connect();
  }
  return connectedClient;
}

function db() {
  if (!connectedClient) {
    throw new Error("MongoDB client is not connected. Call connect() first.");
  }
  return connectedClient.db(env.mongodb.database);
}

module.exports = {
  client,
  connect,
  db,
  generateId,
};

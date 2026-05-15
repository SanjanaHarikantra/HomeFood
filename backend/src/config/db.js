const mongo = require("./mongo");

const useMongo = true;

const legacySqlError = new Error("SQL database support has been removed. Use MongoDB collections through mongoDb().");

const pool = {
  async getConnection() {
    throw legacySqlError;
  },
};

async function query(sql, params = []) {
  throw legacySqlError;
}

async function connectMongo() {
  return mongo.connect();
}

function mongoDb() {
  return mongo.db();
}

module.exports = {
  pool,
  query,
  useMongo,
  connectMongo,
  mongoDb,
  generateId: mongo.generateId,
};

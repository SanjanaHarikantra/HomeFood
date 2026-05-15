const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb } = require("../config/db");

const getHealth = asyncHandler(async (req, res) => {
  if (useMongo) {
    const ping = await mongoDb().command({ ping: 1 });
    return res.json({
      success: true,
      message: "Backend is healthy",
      db: ping.ok === 1 ? "connected" : "unknown",
    });
  }

  const rows = await query("SELECT 1 AS ok");
  res.json({
    success: true,
    message: "Backend is healthy",
    db: rows[0]?.ok === 1 ? "connected" : "unknown",
  });
});

module.exports = {
  getHealth,
};


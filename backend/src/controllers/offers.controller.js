const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb, generateId } = require("../config/db");

const listCoupons = asyncHandler(async (req, res) => {
  if (useMongo) {
    const rows = await mongoDb()
      .collection("coupons")
      .find({ is_active: 1 })
      .sort({ id: -1 })
      .toArray();
    return res.json({ success: true, data: rows });
  }

  const rows = await query(
    `
      SELECT id, code, label, type, value, min_order, max_discount, is_active
      FROM coupons
      WHERE is_active = 1
      ORDER BY id DESC
    `
  );

  res.json({ success: true, data: rows });
});

const applyReferralReward = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const { source = "Referral", cash = 0, gold = 0 } = req.body;
  const cashValue = Number(cash || 0);
  const goldValue = Number(gold || 0);

  if (cashValue <= 0 && goldValue <= 0) {
    return res.status(400).json({
      success: false,
      message: "cash or gold must be greater than 0.",
    });
  }

  if (useMongo) {
    const wallets = mongoDb().collection("wallets");
    const walletTransactions = mongoDb().collection("wallet_transactions");
    const goldTransactions = mongoDb().collection("gold_transactions");

    if (cashValue > 0) {
      await wallets.updateOne(
        { user_id: userId },
        {
          $inc: { balance: cashValue },
          $setOnInsert: { user_id: userId, gold_points: 0, updated_at: new Date() },
          $currentDate: { updated_at: true },
        },
        { upsert: true }
      );
      const txnId = generateId();
      await walletTransactions.insertOne({
        id: txnId,
        _id: txnId,
        user_id: userId,
        title: `${source} Wallet Credit`,
        amount: cashValue,
        status: "Success",
        kind: "credit",
        created_at: new Date(),
      });
    }

    if (goldValue > 0) {
      await wallets.updateOne(
        { user_id: userId },
        {
          $inc: { gold_points: goldValue },
          $setOnInsert: { user_id: userId, balance: 0, updated_at: new Date() },
          $currentDate: { updated_at: true },
        },
        { upsert: true }
      );
      const goldId = generateId();
      await goldTransactions.insertOne({
        id: goldId,
        _id: goldId,
        user_id: userId,
        title: `${source} Gold Bonus`,
        points: goldValue,
        kind: "earned",
        created_at: new Date(),
      });
    }

    return res.json({ success: true, message: "Referral reward applied." });
  }

  if (cashValue > 0) {
    await query("UPDATE wallets SET balance = balance + ? WHERE user_id = ?", [cashValue, userId]);
    await query(
      `
        INSERT INTO wallet_transactions (user_id, title, amount, status, kind)
        VALUES (?, ?, ?, 'Success', 'credit')
      `,
      [userId, `${source} Wallet Credit`, cashValue]
    );
  }

  if (goldValue > 0) {
    await query("UPDATE wallets SET gold_points = gold_points + ? WHERE user_id = ?", [goldValue, userId]);
    await query(
      "INSERT INTO gold_transactions (user_id, title, points, kind) VALUES (?, ?, ?, 'earned')",
      [userId, `${source} Gold Bonus`, goldValue]
    );
  }

  res.json({ success: true, message: "Referral reward applied." });
});

module.exports = {
  listCoupons,
  applyReferralReward,
};


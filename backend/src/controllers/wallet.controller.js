const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb, generateId } = require("../config/db");

const getWallet = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  if (useMongo) {
    const db = mongoDb();
    const wallets = db.collection("wallets");
    const walletTransactions = db.collection("wallet_transactions");
    const goldTransactions = db.collection("gold_transactions");

    let wallet = await wallets.findOne({ user_id: userId });
    if (!wallet) {
      const id = generateId();
      const data = {
        id,
        _id: id,
        user_id: userId,
        balance: 0,
        gold_points: 0,
        updated_at: new Date(),
      };
      await wallets.insertOne(data);
      wallet = data;
    }

    const transactions = await walletTransactions
      .find({ user_id: userId })
      .sort({ id: -1 })
      .limit(50)
      .toArray();
    const goldHistory = await goldTransactions
      .find({ user_id: userId })
      .sort({ id: -1 })
      .limit(50)
      .toArray();

    return res.json({
      success: true,
      data: {
        wallet,
        transactions,
        goldHistory,
      },
    });
  }

  const walletRows = await query(
    "SELECT id, user_id, balance, gold_points, updated_at FROM wallets WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (!walletRows[0]) {
    await query("INSERT INTO wallets (user_id, balance, gold_points) VALUES (?, 0, 0)", [userId]);
  }

  const [wallet] = await query(
    "SELECT id, user_id, balance, gold_points, updated_at FROM wallets WHERE user_id = ? LIMIT 1",
    [userId]
  );

  const transactions = await query(
    `
      SELECT id, user_id, title, amount, status, kind, created_at
      FROM wallet_transactions
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 50
    `,
    [userId]
  );

  const goldHistory = await query(
    `
      SELECT id, user_id, title, points, kind, created_at
      FROM gold_transactions
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 50
    `,
    [userId]
  );

  res.json({
    success: true,
    data: {
      wallet,
      transactions,
      goldHistory,
    },
  });
});

const addMoney = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const { amount, method } = req.body;
  const value = Number(amount || 0);

  if (value <= 0) {
    return res.status(400).json({
      success: false,
      message: "amount must be greater than 0.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const wallets = db.collection("wallets");
    const walletTransactions = db.collection("wallet_transactions");
    const earnedGold = Math.floor(value / 500) * 20;

    await wallets.updateOne(
      { user_id: userId },
      {
        $inc: { balance: value },
        $setOnInsert: { user_id: userId, gold_points: 0 },
        $currentDate: { updated_at: true },
      },
      { upsert: true }
    );

    const txnId = generateId();
    await walletTransactions.insertOne({
      id: txnId,
      _id: txnId,
      user_id: userId,
      title: `Added via ${method || "UPI"}`,
      amount: value,
      status: "Success",
      kind: "credit",
      created_at: new Date(),
    });

    if (earnedGold > 0) {
      const goldTransactions = db.collection("gold_transactions");
      await wallets.updateOne(
        { user_id: userId },
        { $inc: { gold_points: earnedGold }, $currentDate: { updated_at: true } }
      );
      const goldId = generateId();
      await goldTransactions.insertOne({
        id: goldId,
        _id: goldId,
        user_id: userId,
        title: "Wallet Top-up Reward",
        points: earnedGold,
        kind: "earned",
        created_at: new Date(),
      });
    }

    return res.json({ success: true, message: "Money added to wallet." });
  }

  await query("UPDATE wallets SET balance = balance + ? WHERE user_id = ?", [value, userId]);

  await query(
    `
      INSERT INTO wallet_transactions (user_id, title, amount, status, kind)
      VALUES (?, ?, ?, 'Success', 'credit')
    `,
    [userId, `Added via ${method || "UPI"}`, value]
  );

  const earnedGold = Math.floor(value / 500) * 20;
  if (earnedGold > 0) {
    await query("UPDATE wallets SET gold_points = gold_points + ? WHERE user_id = ?", [earnedGold, userId]);
    await query(
      `
        INSERT INTO gold_transactions (user_id, title, points, kind)
        VALUES (?, 'Wallet Top-up Reward', ?, 'earned')
      `,
      [userId, earnedGold]
    );
  }

  res.json({
    success: true,
    message: "Money added to wallet.",
  });
});

const redeemGold = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const { reward } = req.body;

  const costByReward = {
    discount50: 100,
    freeDelivery: 50,
    cashback: 150,
  };
  const titleByReward = {
    discount50: "Redeemed Rs50 OFF",
    freeDelivery: "Redeemed Free Delivery",
    cashback: "Redeemed Cashback",
  };

  if (!costByReward[reward]) {
    return res.status(400).json({
      success: false,
      message: "Invalid reward type.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const wallets = db.collection("wallets");
    const goldTransactions = db.collection("gold_transactions");
    const walletTransactions = db.collection("wallet_transactions");

    const wallet = await wallets.findOne({ user_id: userId });
    if (!wallet || Number(wallet.gold_points) < costByReward[reward]) {
      return res.status(400).json({ success: false, message: "Not enough gold points." });
    }

    await wallets.updateOne(
      { user_id: userId },
      { $inc: { gold_points: -costByReward[reward] }, $currentDate: { updated_at: true } }
    );

    const goldId = generateId();
    await goldTransactions.insertOne({
      id: goldId,
      _id: goldId,
      user_id: userId,
      title: titleByReward[reward],
      points: costByReward[reward],
      kind: "used",
      created_at: new Date(),
    });

    if (reward === "cashback") {
      await wallets.updateOne(
        { user_id: userId },
        { $inc: { balance: 50 }, $currentDate: { updated_at: true } }
      );
      const txnId = generateId();
      await walletTransactions.insertOne({
        id: txnId,
        _id: txnId,
        user_id: userId,
        title: "Gold Cashback Credit",
        amount: 50,
        status: "Success",
        kind: "credit",
        created_at: new Date(),
      });
    }

    return res.json({
      success: true,
      message: "Reward redeemed successfully.",
    });
  }

  const walletRows = await query("SELECT gold_points FROM wallets WHERE user_id = ? LIMIT 1", [userId]);
  const wallet = walletRows[0];
  if (!wallet || Number(wallet.gold_points) < costByReward[reward]) {
    return res.status(400).json({
      success: false,
      message: "Not enough gold points.",
    });
  }

  await query("UPDATE wallets SET gold_points = gold_points - ? WHERE user_id = ?", [
    costByReward[reward],
    userId,
  ]);
  await query(
    "INSERT INTO gold_transactions (user_id, title, points, kind) VALUES (?, ?, ?, 'used')",
    [userId, titleByReward[reward], costByReward[reward]]
  );

  if (reward === "cashback") {
    await query("UPDATE wallets SET balance = balance + 50 WHERE user_id = ?", [userId]);
    await query(
      `
        INSERT INTO wallet_transactions (user_id, title, amount, status, kind)
        VALUES (?, 'Gold Cashback Credit', 50, 'Success', 'credit')
      `,
      [userId]
    );
  }

  res.json({
    success: true,
    message: "Reward redeemed successfully.",
  });
});

module.exports = {
  getWallet,
  addMoney,
  redeemGold,
};

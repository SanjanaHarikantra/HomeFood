const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb, generateId } = require("../config/db");

const listPlans = asyncHandler(async (req, res) => {
  if (useMongo) {
    const rows = await mongoDb()
      .collection("subscription_plans")
      .find({ is_active: 1 })
      .sort({ price: 1 })
      .toArray();
    return res.json({ success: true, data: rows });
  }

  const rows = await query(
    `
      SELECT id, name, price, duration_days, description, is_active
      FROM subscription_plans
      WHERE is_active = 1
      ORDER BY price ASC
    `
  );
  res.json({ success: true, data: rows });
});

const createSubscription = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const planId = Number(req.body.planId);
  const addressId = Number(req.body.addressId);
  const paymentMethod = String(req.body.paymentMethod || "").trim();

  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid userId is required.",
    });
  }

  if (!Number.isFinite(planId) || planId <= 0 || !Number.isFinite(addressId) || addressId <= 0 || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "planId, addressId and paymentMethod are required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const plan = await db.collection("subscription_plans").findOne({ id: planId, is_active: 1 });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found." });
    }

    const address = await db.collection("addresses").findOne({ id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found for this user." });
    }

    const startsOn = new Date();
    const endsOn = new Date(startsOn);
    endsOn.setDate(startsOn.getDate() + Number(plan.duration_days));

    const id = generateId();
    const subscription = {
      id,
      _id: id,
      user_id: userId,
      plan_id: planId,
      address_id: addressId,
      payment_method: paymentMethod,
      amount: Number(plan.price),
      starts_on: startsOn,
      ends_on: endsOn,
      status: "Active",
      created_at: new Date(),
    };

    await db.collection("user_subscriptions").insertOne(subscription);

    return res.status(201).json({
      success: true,
      message: "Subscription created.",
      data: subscription,
    });
  }

  const plans = await query(
    "SELECT id, price, duration_days FROM subscription_plans WHERE id = ? AND is_active = 1 LIMIT 1",
    [planId]
  );

  if (!plans[0]) {
    return res.status(404).json({ success: false, message: "Plan not found." });
  }

  const plan = plans[0];

  const addresses = await query(
    "SELECT id FROM addresses WHERE id = ? AND user_id = ? LIMIT 1",
    [addressId, userId]
  );

  if (!addresses[0]) {
    return res.status(404).json({ success: false, message: "Address not found for this user." });
  }

  const result = await query(
    `
      INSERT INTO user_subscriptions (user_id, plan_id, address_id, payment_method, amount, starts_on, ends_on, status)
      VALUES (?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY), 'Active')
    `,
    [userId, planId, addressId, paymentMethod, plan.price, plan.duration_days]
  );

  const created = await query(
    `
      SELECT id, user_id, plan_id, address_id, payment_method, amount, starts_on, ends_on, status, created_at
      FROM user_subscriptions
      WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: "Subscription created.",
    data: created[0],
  });
});

const listUserSubscriptions = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  if (useMongo) {
    const db = mongoDb();
    const rows = await db.collection("user_subscriptions").find({ user_id: userId }).sort({ id: -1 }).toArray();
    const planIds = [...new Set(rows.map((row) => row.plan_id))];
    const plans = await db.collection("subscription_plans").find({ id: { $in: planIds } }).toArray();
    const planMap = Object.fromEntries(plans.map((plan) => [plan.id, plan.name]));

    return res.json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        plan_name: planMap[row.plan_id] || null,
      })),
    });
  }

  const rows = await query(
    `
      SELECT us.id, us.user_id, us.plan_id, sp.name AS plan_name, us.address_id, us.payment_method,
             us.amount, us.starts_on, us.ends_on, us.status, us.created_at
      FROM user_subscriptions us
      JOIN subscription_plans sp ON sp.id = us.plan_id
      WHERE us.user_id = ?
      ORDER BY us.id DESC
    `,
    [userId]
  );

  res.json({ success: true, data: rows });
});

module.exports = {
  listPlans,
  createSubscription,
  listUserSubscriptions,
};

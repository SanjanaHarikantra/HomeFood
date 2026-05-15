const asyncHandler = require("../utils/asyncHandler");
const { pool, query, useMongo, mongoDb, generateId } = require("../config/db");

const DEFAULT_TRACKING_TIMELINE = [
  "Placed",
  "Accepted",
  "Preparing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const buildTrackingResponse = (order, events = [], delivery = null, chef = null) => {
  const completedStatuses = new Set(events.map((event) => event.status));
  const fallbackStatus = order.status || "Placed";
  const timeline = DEFAULT_TRACKING_TIMELINE.map((status) => ({
    label: status,
    completed:
      completedStatuses.has(status) ||
      DEFAULT_TRACKING_TIMELINE.indexOf(status) <= DEFAULT_TRACKING_TIMELINE.indexOf(fallbackStatus),
    active: status === fallbackStatus,
  }));

  return {
    order,
    chef,
    delivery,
    events,
    timeline,
  };
};

const listOrders = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  if (useMongo) {
    const db = mongoDb();
    const orders = await db
      .collection("orders")
      .find({ user_id: userId })
      .sort({ id: -1 })
      .toArray();

    const itemPromises = orders.map(async (order) => {
      const items = await db
        .collection("order_items")
        .find({ order_id: order.id })
        .toArray();

      const mealIds = items.filter((item) => item.meal_id).map((item) => item.meal_id);
      const menuItemIds = items.filter((item) => item.menu_item_id).map((item) => item.menu_item_id);

      const [meals, menuItems] = await Promise.all([
        mealIds.length
          ? db.collection("meals").find({ id: { $in: mealIds } }).toArray()
          : Promise.resolve([]),
        menuItemIds.length
          ? db.collection("chef_menu_items").find({ id: { $in: menuItemIds } }).toArray()
          : Promise.resolve([]),
      ]);

      const mealMap = Object.fromEntries(meals.map((m) => [m.id, m.title]));
      const menuItemMap = Object.fromEntries(menuItems.map((m) => [m.id, m.title]));

      order.items = items.map((item) => ({
        ...item,
        title: mealMap[item.meal_id] || menuItemMap[item.menu_item_id] || "Order item",
      }));
      return order;
    });

    const ordersWithItems = await Promise.all(itemPromises);
    return res.json({ success: true, data: ordersWithItems });
  }

  const orders = await query(
    `
      SELECT id, order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
    `,
    [userId]
  );

  for (const order of orders) {
    const items = await query(
      `
        SELECT
          oi.id,
          oi.meal_id,
          oi.menu_item_id,
          COALESCE(m.title, cmi.title, 'Order item') AS title,
          oi.price,
          oi.quantity
        FROM order_items oi
        LEFT JOIN meals m ON m.id = oi.meal_id
        LEFT JOIN chef_menu_items cmi ON cmi.id = oi.menu_item_id
        WHERE oi.order_id = ?
      `,
      [order.id]
    );
    order.items = items;
  }

  res.json({ success: true, data: orders });
});

const placeOrder = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const { items = [], addressId, paymentMethod, couponCode = "", walletUsed = 0 } = req.body;
  const walletUsedAmount = Math.max(0, Number(walletUsed || 0));

  if (!Array.isArray(items) || items.length === 0 || !addressId || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "items, addressId and paymentMethod are required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    let subtotal = 0;
    const normalizedItems = [];

    for (const item of items) {
      const mealId = Number(item.mealId);
      const quantity = Number(item.quantity || 1);
      if (!mealId || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid meal item payload." });
      }

      const meal = await db.collection("meals").findOne({ id: mealId, is_active: 1 });
      if (!meal) {
        return res.status(404).json({ success: false, message: `Meal not found for id ${mealId}` });
      }

      subtotal += Number(meal.price) * quantity;
      normalizedItems.push({ mealId, quantity, price: Number(meal.price) });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await db.collection("coupons").findOne({ code: String(couponCode).toUpperCase(), is_active: 1 });
      if (coupon && subtotal >= Number(coupon.min_order || 0)) {
        if (coupon.type === "flat") {
          discount = Number(coupon.value);
        } else {
          discount = Math.round((subtotal * Number(coupon.value)) / 100);
        }
        if (coupon.max_discount !== null && coupon.max_discount !== undefined) {
          discount = Math.min(discount, Number(coupon.max_discount));
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const rewardBase = Math.max(0, total - walletUsedAmount);
    const orderCode = `ORD-${Date.now()}`;
    const orderId = generateId();

    const order = {
      id: orderId,
      _id: orderId,
      order_code: orderCode,
      user_id: userId,
      chef_id: null,
      address_id: Number(addressId),
      order_type: "normal",
      payment_method: paymentMethod,
      subtotal,
      discount,
      total,
      status: "Placed",
      created_at: new Date(),
    };

    await db.collection("orders").insertOne(order);

    if (walletUsedAmount > 0) {
      await db.collection("wallets").updateOne(
        { user_id: userId },
        {
          $inc: { balance: -walletUsedAmount },
          $setOnInsert: { user_id: userId, gold_points: 0, updated_at: new Date() },
          $currentDate: { updated_at: true },
        },
        { upsert: true }
      );
      const txnId = generateId();
      await db.collection("wallet_transactions").insertOne({
        id: txnId,
        _id: txnId,
        user_id: userId,
        title: "Order Payment",
        amount: walletUsedAmount,
        status: "Success",
        kind: "debit",
        created_at: new Date(),
      });
    }

    for (const item of normalizedItems) {
      const itemId = generateId();
      await db.collection("order_items").insertOne({
        id: itemId,
        _id: itemId,
        order_id: orderId,
        meal_id: item.mealId,
        menu_item_id: null,
        price: item.price,
        quantity: item.quantity,
      });
    }

    const earnedGold = Math.floor(rewardBase / 100) * 10;
    const cashback = Math.min(50, Math.round(rewardBase * 0.1));

    if (cashback > 0 || earnedGold > 0) {
      await db.collection("wallets").updateOne(
        { user_id: userId },
        {
          $inc: { balance: cashback, gold_points: earnedGold },
          $setOnInsert: { user_id: userId, balance: 0, gold_points: 0 },
          $currentDate: { updated_at: true },
        },
        { upsert: true }
      );
    }

    if (cashback > 0) {
      const cashbackId = generateId();
      await db.collection("wallet_transactions").insertOne({
        id: cashbackId,
        _id: cashbackId,
        user_id: userId,
        title: "Cashback Reward",
        amount: cashback,
        status: "Success",
        kind: "credit",
        created_at: new Date(),
      });
    }

    if (earnedGold > 0) {
      const goldId = generateId();
      await db.collection("gold_transactions").insertOne({
        id: goldId,
        _id: goldId,
        user_id: userId,
        title: "Order Reward",
        points: earnedGold,
        kind: "earned",
        created_at: new Date(),
      });
    }

    await db.collection("order_tracking_events").insertOne({
      id: generateId(),
      _id: generateId(),
      order_id: orderId,
      status: "Placed",
      note: "Order placed successfully.",
      created_at: new Date(),
    });

    const created = await db.collection("orders").findOne({ id: orderId });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: created,
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let subtotal = 0;
    const normalizedItems = [];

    for (const item of items) {
      const mealId = Number(item.mealId);
      const quantity = Number(item.quantity || 1);
      if (!mealId || quantity <= 0) {
        throw new Error("Invalid meal item payload.");
      }

      const [mealRows] = await conn.execute(
        "SELECT id, title, price FROM meals WHERE id = ? AND is_active = 1 LIMIT 1",
        [mealId]
      );
      const meal = mealRows[0];
      if (!meal) {
        throw new Error(`Meal not found for id ${mealId}`);
      }

      subtotal += Number(meal.price) * quantity;
      normalizedItems.push({ mealId, quantity, price: Number(meal.price) });
    }

    let discount = 0;
    if (couponCode) {
      const [couponRows] = await conn.execute(
        `
          SELECT code, type, value, min_order, max_discount, is_active
          FROM coupons
          WHERE code = ? AND is_active = 1
          LIMIT 1
        `,
        [String(couponCode).toUpperCase()]
      );

      const coupon = couponRows[0];
      if (coupon && subtotal >= Number(coupon.min_order || 0)) {
        if (coupon.type === "flat") {
          discount = Number(coupon.value);
        } else {
          discount = Math.round((subtotal * Number(coupon.value)) / 100);
        }
        if (coupon.max_discount !== null) {
          discount = Math.min(discount, Number(coupon.max_discount));
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const rewardBase = Math.max(0, total - walletUsedAmount);
    const orderCode = `ORD-${Date.now()}`;

    const [orderResult] = await conn.execute(
      `
        INSERT INTO orders (order_code, user_id, address_id, payment_method, subtotal, discount, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Placed')
      `,
      [orderCode, userId, addressId, paymentMethod, subtotal, discount, total]
    );

    const orderId = orderResult.insertId;

    if (walletUsedAmount > 0) {
      await conn.execute(
        "INSERT INTO wallets (user_id, balance, gold_points) VALUES (?, 0, 0) ON DUPLICATE KEY UPDATE user_id = user_id",
        [userId]
      );
      await conn.execute(
        "UPDATE wallets SET balance = GREATEST(balance - ?, 0) WHERE user_id = ?",
        [walletUsedAmount, userId]
      );
      await conn.execute(
        `
          INSERT INTO wallet_transactions (user_id, title, amount, status, kind)
          VALUES (?, 'Order Payment', ?, 'Success', 'debit')
        `,
        [userId, walletUsedAmount]
      );
    }

    for (const item of normalizedItems) {
      await conn.execute(
        `
          INSERT INTO order_items (order_id, meal_id, price, quantity)
          VALUES (?, ?, ?, ?)
        `,
        [orderId, item.mealId, item.price, item.quantity]
      );
    }

    const earnedGold = Math.floor(rewardBase / 100) * 10;
    const cashback = Math.min(50, Math.round(rewardBase * 0.1));

    await conn.execute(
      "UPDATE wallets SET balance = balance + ?, gold_points = gold_points + ? WHERE user_id = ?",
      [cashback, earnedGold, userId]
    );

    if (cashback > 0) {
      await conn.execute(
        `
          INSERT INTO wallet_transactions (user_id, title, amount, status, kind)
          VALUES (?, 'Cashback Reward', ?, 'Success', 'credit')
        `,
        [userId, cashback]
      );
    }

    if (earnedGold > 0) {
      await conn.execute(
        `
          INSERT INTO gold_transactions (user_id, title, points, kind)
          VALUES (?, 'Order Reward', ?, 'earned')
        `,
        [userId, earnedGold]
      );
    }

    await conn.commit();

    const created = await query(
      `
      SELECT id, order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status, created_at
        FROM orders
        WHERE id = ?
      `,
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: created[0],
    });
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
});

const getOrderTracking = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const orderId = Number(req.params.orderId);

  if (useMongo) {
    const db = mongoDb();
    const order = await db.collection("orders").findOne({ id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const [events, delivery, chef] = await Promise.all([
      db
        .collection("order_tracking_events")
        .find({ order_id: orderId })
        .sort({ id: 1 })
        .toArray(),
      db.collection("delivery_assignments").findOne({ order_id: orderId }),
      order.chef_id
        ? db.collection("home_chefs").findOne({ id: order.chef_id })
        : Promise.resolve(null),
    ]);

    const tracking = buildTrackingResponse(order, events, delivery, chef);
    return res.json({ success: true, data: tracking });
  }

  const orders = await query(
    `
      SELECT id, order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status, created_at
      FROM orders
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `,
    [orderId, userId]
  );

  if (!orders[0]) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  const [events, delivery, chef] = await Promise.all([
    query(
      `
        SELECT id, order_id, status, note, created_at
        FROM order_tracking_events
        WHERE order_id = ?
        ORDER BY id ASC
      `,
      [orderId]
    ).catch(() => []),
    query(
      `
        SELECT id, order_id, partner_name, partner_phone, vehicle_type, status, eta_minutes, pickup_time, dropoff_time, created_at
        FROM delivery_assignments
        WHERE order_id = ?
        LIMIT 1
      `,
      [orderId]
    ).then((rows) => rows[0] || null).catch(() => null),
    query(
      `
        SELECT hc.id, hc.chef_name, hc.kitchen_name, hc.area, hc.city, hc.rating, hc.review_count, hc.image_url
        FROM home_chefs hc
        WHERE hc.id = ?
        LIMIT 1
      `,
      [orders[0].chef_id || 0]
    ).then((rows) => rows[0] || null).catch(() => null),
  ]);

  const tracking = buildTrackingResponse(orders[0], events, delivery, chef);

  res.json({
    success: true,
    data: tracking,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const orderId = Number(req.params.orderId);
  const { status, note, partnerName, partnerPhone, vehicleType, etaMinutes } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "status is required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const order = await db.collection("orders").findOne({ id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    await db.collection("orders").updateOne({ id: orderId }, { $set: { status } });
    await db.collection("order_tracking_events").insertOne({
      id: generateId(),
      _id: generateId(),
      order_id: orderId,
      status,
      note: note || `Order moved to ${status}`,
      created_at: new Date(),
    });

    if (["Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(status)) {
      const deliveryStatus =
        status === "Delivered"
          ? "Delivered"
          : status === "Out for Delivery"
          ? "On the way"
          : status === "Shipped"
          ? "Picked up"
          : "Assigned";

      await db.collection("delivery_assignments").updateOne(
        { order_id: orderId },
        {
          $set: {
            order_id: orderId,
            partner_name: partnerName || "Porter Rider",
            partner_phone: partnerPhone || "1800-180-1234",
            vehicle_type: vehicleType || "Bike",
            status: deliveryStatus,
            eta_minutes: Number(etaMinutes || 30),
          },
        },
        { upsert: true }
      );
    }

    const updated = await db.collection("orders").findOne({ id: orderId });
    return res.json({ success: true, message: "Order status updated.", data: updated });
  }

  const orderRows = await query("SELECT id, user_id, chef_id FROM orders WHERE id = ? AND user_id = ? LIMIT 1", [orderId, userId]);

  if (!orderRows[0]) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    await conn.execute(
      `
        INSERT INTO order_tracking_events (order_id, status, note)
        VALUES (?, ?, ?)
      `,
      [orderId, status, note || `Order moved to ${status}`]
    );

    if (["Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(status)) {
      await conn.execute(
        `
          INSERT INTO delivery_assignments (order_id, partner_name, partner_phone, vehicle_type, status, eta_minutes)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            partner_name = VALUES(partner_name),
            partner_phone = VALUES(partner_phone),
            vehicle_type = VALUES(vehicle_type),
            status = VALUES(status),
            eta_minutes = VALUES(eta_minutes)
        `,
        [
          orderId,
          partnerName || "Porter Rider",
          partnerPhone || "1800-180-1234",
          vehicleType || "Bike",
          status === "Delivered"
            ? "Delivered"
            : status === "Out for Delivery"
            ? "On the way"
            : status === "Shipped"
            ? "Picked up"
            : "Assigned",
          Number(etaMinutes || 30),
        ]
      );
    }

    await conn.commit();

    const updated = await query(
      `
        SELECT id, order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status, created_at
        FROM orders
        WHERE id = ?
        LIMIT 1
      `,
      [orderId]
    );

    res.json({
      success: true,
      message: "Order status updated.",
      data: updated[0],
    });
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
});

module.exports = {
  listOrders,
  placeOrder,
  getOrderTracking,
  updateOrderStatus,
};

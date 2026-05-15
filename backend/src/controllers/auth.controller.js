const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb, generateId } = require("../config/db");

const demoOtps = new Map();
const demoUsers = new Map();
let demoUserId = 1;

const isDbUnavailableError = (error) =>
  error && (error.code === "ECONNREFUSED" || error.code === "ER_ACCESS_DENIED_ERROR");

const normalizeRole = (value) => (String(value || "").toLowerCase() === "chef" ? "chef" : "customer");

const getDemoChefId = (userId) => userId + 1000;

const buildChefSeed = (user) => ({
  chef_name: user.name || "Home Chef",
  kitchen_name: `${user.name || "Home"} Kitchen`,
  area: "Bandra West",
  city: "Mumbai",
  cuisine_tag: "Homemade",
  bio: "Fresh home-style meals from your local kitchen.",
});

const ensureChefProfile = async (user) => {
  if (useMongo) {
    const db = mongoDb();
    const existing = await db.collection("home_chefs").findOne({ user_id: user.id });
    if (existing) {
      return existing.id;
    }

    const chefSeed = buildChefSeed(user);
    const id = generateId();
    const chefDoc = {
      id,
      _id: id,
      user_id: user.id,
      chef_name: chefSeed.chef_name,
      kitchen_name: chefSeed.kitchen_name,
      area: chefSeed.area,
      city: chefSeed.city,
      cuisine_tag: chefSeed.cuisine_tag,
      bio: chefSeed.bio,
      rating: 0,
      review_count: 0,
      delivery_time_mins: 30,
      delivery_radius_km: 5,
      veg_only: 0,
      image_url: null,
      is_active: 1,
      created_at: new Date(),
    };
    await db.collection("home_chefs").insertOne(chefDoc);
    return id;
  }

  const existingRows = await query(
    `
      SELECT id
      FROM home_chefs
      WHERE user_id = ?
      LIMIT 1
    `,
    [user.id]
  );

  if (existingRows[0]) {
    return existingRows[0].id;
  }

  const chefSeed = buildChefSeed(user);
  const result = await query(
    `
      INSERT INTO home_chefs (
        user_id, chef_name, kitchen_name, area, city, cuisine_tag, bio, rating, review_count,
        delivery_time_mins, delivery_radius_km, veg_only, image_url, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 30, 5, 0, NULL, 1)
    `,
    [
      user.id,
      chefSeed.chef_name,
      chefSeed.kitchen_name,
      chefSeed.area,
      chefSeed.city,
      chefSeed.cuisine_tag,
      chefSeed.bio,
    ]
  );

  return result.insertId;
};

const getDemoUser = (phone, role = "customer") => {
  let user = demoUsers.get(phone);
  if (!user) {
    user = {
      id: demoUserId++,
      name: role === "chef" ? "Home Chef" : "Customer",
      phone,
      role,
    };
    demoUsers.set(phone, user);
  }

  if (role === "chef") {
    user.role = "chef";
    user.name = user.name || "Home Chef";
    user.chef_id = user.chef_id || getDemoChefId(user.id);
  } else if (!user.role) {
    user.role = "customer";
  }

  return user;
};

const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Valid 10-digit phone is required.",
    });
  }

  const otp = "1234";

  if (useMongo) {
    const db = mongoDb();
    const id = generateId();
    await db.collection("otp_verifications").insertOne({
      id,
      _id: id,
      phone,
      otp_code: otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      created_at: new Date(),
    });
  } else {
    try {
      await query(
        `
          INSERT INTO otp_verifications (phone, otp_code, expires_at)
          VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
        `,
        [phone, otp]
      );
    } catch (error) {
      if (!isDbUnavailableError(error)) {
        throw error;
      }
      demoOtps.set(phone, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
    }
  }

  res.json({
    success: true,
    message: "OTP generated for testing.",
    data: {
      phone,
      otp,
    },
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp, role: requestedRole } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone and OTP are required.",
    });
  }
  const role = normalizeRole(requestedRole);

  let usingDemoAuth = false;
  let verification = null;

  if (useMongo) {
    const db = mongoDb();
    verification = await db
      .collection("otp_verifications")
      .findOne({ phone, otp_code: otp, expires_at: { $gt: new Date() } }, { sort: { id: -1 } });
    if (!verification) {
      usingDemoAuth = false;
    }
  } else {
    try {
      const rows = await query(
        `
          SELECT id, phone
          FROM otp_verifications
          WHERE phone = ? AND otp_code = ? AND expires_at > NOW()
          ORDER BY id DESC
          LIMIT 1
        `,
        [phone, otp]
      );
      verification = rows[0];
    } catch (error) {
      if (!isDbUnavailableError(error)) {
        throw error;
      }
      usingDemoAuth = true;
    }
  }

  if (!useMongo && usingDemoAuth) {
    const demoRecord = demoOtps.get(phone);
    if (!demoRecord || demoRecord.otp !== otp || demoRecord.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }
  } else if (!verification) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired OTP.",
    });
  }

  let user;
  let chefId = null;

  if (!useMongo && usingDemoAuth) {
    user = getDemoUser(phone, role);
    chefId = user.role === "chef" ? user.chef_id || getDemoChefId(user.id) : null;
  } else if (useMongo) {
    const db = mongoDb();
    user = await db.collection("users").findOne({ phone });

    if (!user) {
      const id = generateId();
      const newUser = {
        id,
        _id: id,
        name: role === "chef" ? "Home Chef" : "Customer",
        phone,
        role,
        created_at: new Date(),
      };
      await db.collection("users").insertOne(newUser);
      user = newUser;
      await db.collection("wallets").updateOne(
        { user_id: user.id },
        { $setOnInsert: { user_id: user.id, balance: 0, gold_points: 0, updated_at: new Date() } },
        { upsert: true }
      );
    } else {
      const nextRole = user.role === "chef" || role === "chef" ? "chef" : "customer";
      if (nextRole !== user.role) {
        await db.collection("users").updateOne({ id: user.id }, { $set: { role: nextRole } });
        user.role = nextRole;
      }
      await db.collection("wallets").updateOne(
        { user_id: user.id },
        { $setOnInsert: { user_id: user.id, balance: 0, gold_points: 0, updated_at: new Date() } },
        { upsert: true }
      );
    }

    if (user.role === "chef") {
      chefId = await ensureChefProfile(user);
    }
  } else {
    const users = await query("SELECT id, name, phone, role FROM users WHERE phone = ? LIMIT 1", [phone]);
    user = users[0];

    if (!user) {
      const insertResult = await query(
        "INSERT INTO users (name, phone, role) VALUES (?, ?, ?)",
        [role === "chef" ? "Home Chef" : "Customer", phone, role]
      );
      const created = await query("SELECT id, name, phone, role FROM users WHERE id = ?", [insertResult.insertId]);
      user = created[0];
      await query("INSERT INTO wallets (user_id, balance, gold_points) VALUES (?, 0, 0)", [user.id]);
    } else {
      const nextRole = user.role === "chef" || role === "chef" ? "chef" : "customer";
      if (nextRole !== user.role) {
        await query("UPDATE users SET role = ? WHERE id = ?", [nextRole, user.id]);
        user.role = nextRole;
      }
      await query(
        "INSERT INTO wallets (user_id, balance, gold_points) VALUES (?, 0, 0) ON DUPLICATE KEY UPDATE user_id = user_id",
        [user.id]
      );
    }

    if (user.role === "chef") {
      chefId = await ensureChefProfile(user);
    }
  }

  res.json({
    success: true,
    message: "OTP verified.",
    data: {
      user: {
        ...user,
        role: user.role || role,
        chef_id: chefId,
      },
      token: `dev-token-${user.id}`,
    },
  });
});

module.exports = {
  sendOtp,
  verifyOtp,
};

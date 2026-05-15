const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb, generateId } = require("../config/db");

const getUserId = (req) => Number(req.params.userId);

const listAddresses = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (useMongo) {
    const rows = await mongoDb()
      .collection("addresses")
      .find({ user_id: userId })
      .sort({ is_default: -1, id: -1 })
      .toArray();
    return res.json({ success: true, data: rows });
  }

  const rows = await query(
    `
      SELECT id, user_id, type, full_address, name, phone, city, pincode, is_default
      FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, id DESC
    `,
    [userId]
  );
  res.json({ success: true, data: rows });
});

const createAddress = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { type, fullAddress, name, phone, city, pincode, isDefault = false } = req.body;

  if (!fullAddress || !name || !phone || !city || !pincode) {
    return res.status(400).json({
      success: false,
      message: "fullAddress, name, phone, city, and pincode are required.",
    });
  }

  if (useMongo) {
    const addresses = mongoDb().collection("addresses");
    if (isDefault) {
      await addresses.updateMany({ user_id: userId }, { $set: { is_default: false } });
    }

    const id = generateId();
    const address = {
      id,
      _id: id,
      user_id: userId,
      type: type || "Home",
      full_address: fullAddress,
      name,
      phone,
      city,
      pincode,
      is_default: Boolean(isDefault),
      created_at: new Date(),
    };
    await addresses.insertOne(address);
    return res.status(201).json({ success: true, data: address });
  }

  if (isDefault) {
    await query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
  }

  const result = await query(
    `
      INSERT INTO addresses (user_id, type, full_address, name, phone, city, pincode, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, type || "Home", fullAddress, name, phone, city, pincode, isDefault ? 1 : 0]
  );

  const created = await query(
    `
      SELECT id, user_id, type, full_address, name, phone, city, pincode, is_default
      FROM addresses
      WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({ success: true, data: created[0] });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const addressId = Number(req.params.addressId);

  if (useMongo) {
    await mongoDb().collection("addresses").deleteOne({ id: addressId, user_id: userId });
    return res.json({ success: true, message: "Address deleted." });
  }

  await query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [addressId, userId]);

  res.json({ success: true, message: "Address deleted." });
});

module.exports = {
  listAddresses,
  createAddress,
  deleteAddress,
};


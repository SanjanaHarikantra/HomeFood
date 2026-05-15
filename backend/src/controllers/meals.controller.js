const asyncHandler = require("../utils/asyncHandler");
const { query, useMongo, mongoDb } = require("../config/db");

const getMeals = asyncHandler(async (req, res) => {
  const { search = "", category = "" } = req.query;

  if (useMongo) {
    const filter = { is_active: 1 };
    if (search.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }
    if (category.trim()) {
      filter.tag = category.trim();
    }

    const rows = await mongoDb()
      .collection("meals")
      .find(filter)
      .sort({ id: -1 })
      .toArray();

    return res.json({ success: true, data: rows });
  }

  const rows = await query(
    `
      SELECT id, title, description, price, image_url, rating, tag, is_active
      FROM meals
      WHERE is_active = 1
        AND (? = '' OR title LIKE CONCAT('%', ?, '%'))
        AND (? = '' OR tag = ?)
      ORDER BY id DESC
    `,
    [search, search, category, category]
  );

  res.json({ success: true, data: rows });
});

const getMealById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (useMongo) {
    const meal = await mongoDb().collection("meals").findOne({ id: Number(id) });
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found." });
    }
    return res.json({ success: true, data: meal });
  }

  const rows = await query(
    "SELECT id, title, description, price, image_url, rating, tag, is_active FROM meals WHERE id = ? LIMIT 1",
    [id]
  );

  if (!rows[0]) {
    return res.status(404).json({
      success: false,
      message: "Meal not found.",
    });
  }

  res.json({ success: true, data: rows[0] });
});

module.exports = {
  getMeals,
  getMealById,
};


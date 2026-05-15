const asyncHandler = require("../utils/asyncHandler");
const { pool, query, useMongo, mongoDb, generateId } = require("../config/db");

const getMenuItemImageUrl = (req, providedImageUrl) => {
  if (req.file) {
    return `/uploads/chef_menu_images/${req.file.filename}`;
  }
  const url = String(providedImageUrl || "").trim();
  return url.length ? url : null;
};

const parseBoolean = (value) => {
  if (value === true || value === 1 || value === "1") return true;
  return String(value || "").trim().toLowerCase() === "true";
};

const demoChefs = [
  {
    id: 1,
    chef_name: "Sushmita Joshi",
    kitchen_name: "Aai's Kitchen",
    area: "Bandra West",
    city: "Mumbai",
    cuisine_tag: "Veg",
    bio: "Warm Maharashtrian thalis, khichdi bowls, and weekly tiffin plans.",
    rating: 4.8,
    review_count: 128,
    delivery_time_mins: 28,
    delivery_radius_km: 6.5,
    veg_only: 1,
    image_url:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
  },
  {
    id: 2,
    chef_name: "Ayesha Khan",
    kitchen_name: "Noor Home Kitchen",
    area: "Andheri East",
    city: "Mumbai",
    cuisine_tag: "Healthy",
    bio: "Protein-rich bowls, low-oil lunchboxes, and office-friendly meals.",
    rating: 4.7,
    review_count: 96,
    delivery_time_mins: 30,
    delivery_radius_km: 6,
    veg_only: 0,
    image_url:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
  },
  {
    id: 3,
    chef_name: "Meenal Patil",
    kitchen_name: "Weekend Dabba Studio",
    area: "Powai",
    city: "Mumbai",
    cuisine_tag: "Budget",
    bio: "Pocket-friendly homestyle meals with rotating specials and family packs.",
    rating: 4.6,
    review_count: 74,
    delivery_time_mins: 35,
    delivery_radius_km: 5,
    veg_only: 1,
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
  },
];

const demoMenuByChef = {
  1: [
    {
      id: 101,
      chef_id: 1,
      title: "Aai's Daily Thali",
      description: "2 phulka, dal fry, jeera rice, sabzi and salad",
      price: 169,
      category: "Lunch",
      tags: "veg,thali,tiffin,budget",
      image_url:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
    {
      id: 102,
      chef_id: 1,
      title: "Comfort Khichdi Combo",
      description: "Moong dal khichdi, ghee, papad, buttermilk",
      price: 149,
      category: "Healthy",
      tags: "veg,healthy,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
  ],
  2: [
    {
      id: 201,
      chef_id: 2,
      title: "Chicken Curry Tiffin",
      description: "Steamed rice, home-style chicken curry, salad",
      price: 249,
      category: "Dinner",
      tags: "non-veg,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
      is_veg: 0,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 0,
      is_available: 1,
    },
    {
      id: 202,
      chef_id: 2,
      title: "Protein Power Box",
      description: "Brown rice, tofu masala, sprouts, curd",
      price: 219,
      category: "Healthy",
      tags: "veg,healthy,protein",
      image_url:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 1,
      is_budget: 0,
      is_available: 1,
    },
  ],
  3: [
    {
      id: 301,
      chef_id: 3,
      title: "Budget Dal Rice",
      description: "Rice, dal tadka, cabbage sabzi and pickle",
      price: 129,
      category: "Budget",
      tags: "veg,budget,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
  ],
};

const demoReviewsByChef = {
  1: [
    {
      id: 1,
      chef_id: 1,
      customer_name: "Rahul",
      rating: 5,
      review_text: "Feels like home every day. Very consistent taste.",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      chef_id: 1,
      customer_name: "Neha",
      rating: 5,
      review_text: "Perfect tiffin portions and always delivered warm.",
      created_at: new Date().toISOString(),
    },
  ],
  2: [
    {
      id: 3,
      chef_id: 2,
      customer_name: "Amit",
      rating: 5,
      review_text: "Great healthy meals for work days.",
      created_at: new Date().toISOString(),
    },
  ],
  3: [
    {
      id: 4,
      chef_id: 3,
      customer_name: "Priya",
      rating: 4,
      review_text: "Budget-friendly and surprisingly tasty.",
      created_at: new Date().toISOString(),
    },
  ],
};

const demoHomemadeOrders = [];
const demoChefOrders = [
  {
    id: 201,
    order_code: "ORD-201",
    customer_name: "Rahul Kumar",
    item_summary: "Veg Thali x3",
    status: "Placed",
    created_at: new Date().toISOString(),
    address: "Andheri West, Mumbai",
    total: 447,
    chef_id: 1,
  },
  {
    id: 202,
    order_code: "ORD-202",
    customer_name: "Ayesha Khan",
    item_summary: "Chicken Curry x2",
    status: "Accepted",
    created_at: new Date().toISOString(),
    address: "Bandra East, Mumbai",
    total: 498,
    chef_id: 1,
  },
];

const isDbUnavailableError = (error) =>
  error && (error.code === "ECONNREFUSED" || error.code === "ER_ACCESS_DENIED_ERROR");

const getDemoChefByUserId = (userId) => demoChefs.find((chef) => Number(chef.id) === Number(userId) || Number(chef.id) === Number(userId) - 1000) || demoChefs[0];

const getChefByUserId = async (userId) => {
  if (useMongo) {
    const db = mongoDb();
    const chef = await db.collection("home_chefs").findOne({ user_id: userId });
    if (!chef) {
      return null;
    }
    if (chef.user_id) {
      const user = await db.collection("users").findOne({ id: chef.user_id });
      return {
        ...chef,
        owner_name: user?.name || undefined,
        owner_phone: user?.phone || undefined,
      };
    }
    return chef;
  }

  const rows = await query(
    `
      SELECT
        hc.id,
        hc.user_id,
        hc.chef_name,
        hc.kitchen_name,
        hc.area,
        hc.city,
        hc.cuisine_tag,
        hc.bio,
        hc.rating,
        hc.review_count,
        hc.delivery_time_mins,
        hc.delivery_radius_km,
        hc.veg_only,
        hc.image_url,
        hc.is_active,
        u.name AS owner_name,
        u.phone AS owner_phone
      FROM home_chefs hc
      LEFT JOIN users u ON u.id = hc.user_id
      WHERE hc.user_id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

const parseChefOrderStatus = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "placed":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "preparing":
      return "Preparing";
    case "ready":
    case "shipped":
      return "Shipped";
    case "out for delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
};

const parseChefRouteStatus = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "accepted":
      return "Accepted";
    case "preparing":
      return "Preparing";
    case "ready":
    case "shipped":
      return "Shipped";
    case "out for delivery":
      return "Out for Delivery";
    case "delivered":
    case "completed":
      return "Delivered";
    case "rejected":
      return "Rejected";
    default:
      return "Placed";
  }
};

const filterItems = (items, queryParams) => {
  const search = String(queryParams.search || "").trim().toLowerCase();
  const veg = String(queryParams.veg || "") === "1";
  const healthy = String(queryParams.healthy || "") === "1";
  const tiffin = String(queryParams.tiffin || "") === "1";
  const budget = String(queryParams.budget || "") === "1";
  const nonVeg = String(queryParams.nonVeg || "") === "1";

  return items.filter((item) => {
    const haystack = [
      item.chef_name,
      item.kitchen_name,
      item.area,
      item.city,
      item.bio || "",
      item.cuisine_tag || "",
    ]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search)) {
      return false;
    }

    if (veg && Number(item.veg_only) !== 1) {
      return false;
    }

    if (nonVeg && Number(item.veg_only) === 1) {
      return false;
    }

    if (healthy && !(demoMenuByChef[item.id] || []).some((menu) => Number(menu.is_healthy) === 1)) {
      return false;
    }

    if (tiffin && !(demoMenuByChef[item.id] || []).some((menu) => Number(menu.is_tiffin) === 1)) {
      return false;
    }

    if (budget && !(demoMenuByChef[item.id] || []).some((menu) => Number(menu.is_budget) === 1)) {
      return false;
    }

    return Boolean(item);
  });
};

const listHomeChefs = asyncHandler(async (req, res) => {
  const search = String(req.query.search || "").trim();
  const veg = String(req.query.veg || "") === "1";
  const nonVeg = String(req.query.nonVeg || "") === "1";
  const healthy = String(req.query.healthy || "") === "1";
  const tiffin = String(req.query.tiffin || "") === "1";
  const budget = String(req.query.budget || "") === "1";

  if (useMongo) {
    const db = mongoDb();
    const filter = { is_active: 1 };

    if (search) {
      filter.$or = [
        { chef_name: { $regex: search, $options: "i" } },
        { kitchen_name: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { cuisine_tag: { $regex: search, $options: "i" } },
      ];
    }

    if (veg && !nonVeg) {
      filter.veg_only = 1;
    }
    if (nonVeg && !veg) {
      filter.veg_only = 0;
    }

    const chefs = await db.collection("home_chefs").find(filter).toArray();
    const menuCounts = await Promise.all(
      chefs.map(async (chef) => ({
        chef_id: chef.id,
        count: await db.collection("chef_menu_items").countDocuments({ chef_id: chef.id, is_available: 1 }),
      }))
    );
    const countMap = Object.fromEntries(menuCounts.map((item) => [item.chef_id, item.count]));

    const result = await Promise.all(
      chefs.map(async (chef) => {
        const healthyMatch = healthy
          ? await db.collection("chef_menu_items").findOne({ chef_id: chef.id, is_healthy: 1, is_available: 1 })
          : true;
        const tiffinMatch = tiffin
          ? await db.collection("chef_menu_items").findOne({ chef_id: chef.id, is_tiffin: 1, is_available: 1 })
          : true;
        const budgetMatch = budget
          ? await db.collection("chef_menu_items").findOne({ chef_id: chef.id, is_budget: 1, is_available: 1 })
          : true;

        return {
          ...chef,
          menu_count: countMap[chef.id] || 0,
          passes: healthyMatch && tiffinMatch && budgetMatch,
        };
      })
    );

    const filteredChefs = result.filter((chef) => chef.passes).map(({ passes, ...chef }) => chef);
    const ordered = filteredChefs.sort((a, b) => {
      if (b.rating !== a.rating) return Number(b.rating || 0) - Number(a.rating || 0);
      return Number(b.review_count || 0) - Number(a.review_count || 0);
    });

    return res.json({ success: true, data: ordered });
  }

  try {
    const rows = await query(
      `
        SELECT
          hc.id,
          hc.chef_name,
          hc.kitchen_name,
          hc.area,
          hc.city,
          hc.cuisine_tag,
          hc.bio,
          hc.rating,
          hc.review_count,
          hc.delivery_time_mins,
          hc.delivery_radius_km,
          hc.veg_only,
          hc.image_url,
          hc.is_active,
          (
            SELECT COUNT(*)
            FROM chef_menu_items cmi
            WHERE cmi.chef_id = hc.id AND cmi.is_available = 1
          ) AS menu_count
        FROM home_chefs hc
        WHERE hc.is_active = 1
          AND (? = '' OR CONCAT(hc.chef_name, ' ', hc.kitchen_name, ' ', hc.area, ' ', hc.city, ' ', hc.bio) LIKE CONCAT('%', ?, '%'))
          AND (? = 0 OR hc.veg_only = 1)
          AND (? = 0 OR hc.veg_only = 0)
          AND (
            ? = 0
            OR EXISTS (
              SELECT 1 FROM chef_menu_items cmi WHERE cmi.chef_id = hc.id AND cmi.is_healthy = 1
            )
          )
          AND (
            ? = 0
            OR EXISTS (
              SELECT 1 FROM chef_menu_items cmi WHERE cmi.chef_id = hc.id AND cmi.is_tiffin = 1
            )
          )
          AND (
            ? = 0
            OR EXISTS (
              SELECT 1 FROM chef_menu_items cmi WHERE cmi.chef_id = hc.id AND cmi.is_budget = 1
            )
          )
        ORDER BY hc.rating DESC, hc.review_count DESC
      `,
      [
        search,
        search,
        veg ? 1 : 0,
        nonVeg ? 1 : 0,
        healthy ? 1 : 0,
        tiffin ? 1 : 0,
        budget ? 1 : 0,
      ]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    return res.json({
      success: true,
      data: filterItems(demoChefs, req.query).map((chef) => ({
        ...chef,
        menu_count: (demoMenuByChef[chef.id] || []).length,
      })),
    });
  }
});

const getChefById = asyncHandler(async (req, res) => {
  const chefId = Number(req.params.chefId);

  if (useMongo) {
    const chef = await mongoDb().collection("home_chefs").findOne({ id: chefId, is_active: 1 });
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef not found." });
    }
    return res.json({ success: true, data: chef });
  }

  try {
    const rows = await query(
      `
        SELECT
          hc.id,
          hc.chef_name,
          hc.kitchen_name,
          hc.area,
          hc.city,
          hc.cuisine_tag,
          hc.bio,
          hc.rating,
          hc.review_count,
          hc.delivery_time_mins,
          hc.delivery_radius_km,
          hc.veg_only,
          hc.image_url,
          hc.is_active
        FROM home_chefs hc
        WHERE hc.id = ? AND hc.is_active = 1
        LIMIT 1
      `,
      [chefId]
    );

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: "Chef not found." });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = demoChefs.find((item) => item.id === chefId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef not found." });
    }

    return res.json({ success: true, data: chef });
  }
});

const getChefMenu = asyncHandler(async (req, res) => {
  const chefId = Number(req.params.chefId);
  const search = String(req.query.search || "").trim();
  const flags = {
    veg: String(req.query.veg || "") === "1",
    healthy: String(req.query.healthy || "") === "1",
    tiffin: String(req.query.tiffin || "") === "1",
    budget: String(req.query.budget || "") === "1",
  };

  if (useMongo) {
    const filter = { chef_id: chefId, is_available: 1 };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (flags.veg) filter.is_veg = 1;
    if (flags.healthy) filter.is_healthy = 1;
    if (flags.tiffin) filter.is_tiffin = 1;
    if (flags.budget) filter.is_budget = 1;

    const rows = await mongoDb().collection("chef_menu_items").find(filter).sort({ id: 1 }).toArray();
    return res.json({ success: true, data: rows });
  }

  try {
    const rows = await query(
      `
        SELECT id, chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget, is_available
        FROM chef_menu_items
        WHERE chef_id = ?
          AND is_available = 1
          AND (? = '' OR title LIKE CONCAT('%', ?, '%') OR description LIKE CONCAT('%', ?, '%') OR tags LIKE CONCAT('%', ?, '%'))
          AND (? = 0 OR is_veg = 1)
          AND (? = 0 OR is_healthy = 1)
          AND (? = 0 OR is_tiffin = 1)
          AND (? = 0 OR is_budget = 1)
        ORDER BY id ASC
      `,
      [
        chefId,
        search,
        search,
        search,
        search,
        flags.veg ? 1 : 0,
        flags.healthy ? 1 : 0,
        flags.tiffin ? 1 : 0,
        flags.budget ? 1 : 0,
      ]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    let rows = demoMenuByChef[chefId] || [];
    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter((item) =>
        [item.title, item.description, item.category, item.tags].join(" ").toLowerCase().includes(needle)
      );
    }
    if (flags.veg) rows = rows.filter((item) => Number(item.is_veg) === 1);
    if (flags.healthy) rows = rows.filter((item) => Number(item.is_healthy) === 1);
    if (flags.tiffin) rows = rows.filter((item) => Number(item.is_tiffin) === 1);
    if (flags.budget) rows = rows.filter((item) => Number(item.is_budget) === 1);

    return res.json({ success: true, data: rows });
  }
});

const getChefReviews = asyncHandler(async (req, res) => {
  const chefId = Number(req.params.chefId);

  if (useMongo) {
    const db = mongoDb();
    const rows = await db
      .collection("chef_reviews")
      .find({ chef_id: chefId })
      .sort({ id: -1 })
      .toArray();

    const customerIds = [...new Set(rows.filter((item) => item.customer_id).map((item) => item.customer_id))];
    const users = customerIds.length
      ? await db.collection("users").find({ id: { $in: customerIds } }).toArray()
      : [];
    const userMap = Object.fromEntries(users.map((user) => [user.id, user.name]));

    return res.json({
      success: true,
      data: rows.map((review) => ({
        ...review,
        customer_name: userMap[review.customer_id] || "Customer",
      })),
    });
  }

  try {
    const rows = await query(
      `
        SELECT cr.id, cr.chef_id, cr.customer_id, cr.order_id, cr.rating, cr.review_text, cr.created_at,
               COALESCE(u.name, 'Customer') AS customer_name
        FROM chef_reviews cr
        LEFT JOIN users u ON u.id = cr.customer_id
        WHERE cr.chef_id = ?
        ORDER BY cr.id DESC
      `,
      [chefId]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    return res.json({ success: true, data: demoReviewsByChef[chefId] || [] });
  }
});

const createChefReview = asyncHandler(async (req, res) => {
  const chefId = Number(req.params.chefId);
  const { customerId = null, orderId = null, rating, reviewText } = req.body;

  if (!rating || !reviewText) {
    return res.status(400).json({
      success: false,
      message: "rating and reviewText are required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const reviewId = generateId();
    const createdAt = new Date().toISOString();
    const newReview = {
      id: reviewId,
      chef_id: chefId,
      customer_id: customerId,
      order_id: orderId,
      rating: Number(rating),
      review_text: reviewText,
      created_at: createdAt,
    };

    await db.collection("chef_reviews").insertOne(newReview);

    const [stats] = await db
      .collection("chef_reviews")
      .aggregate([
        { $match: { chef_id: chefId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray();

    await db.collection("home_chefs").updateOne(
      { id: chefId },
      {
        $set: {
          review_count: stats?.count || 0,
          rating: Number((stats?.avgRating || 0).toFixed(2)),
        },
      }
    );

    const customer = customerId ? await db.collection("users").findOne({ id: customerId }) : null;
    return res.status(201).json({
      success: true,
      data: {
        ...newReview,
        customer_name: customer?.name || "Customer",
      },
    });
  }

  try {
    const result = await query(
      `
        INSERT INTO chef_reviews (chef_id, customer_id, order_id, rating, review_text)
        VALUES (?, ?, ?, ?, ?)
      `,
      [chefId, customerId, orderId, rating, reviewText]
    );

    await query(
      `
        UPDATE home_chefs
        SET review_count = review_count + 1,
            rating = (
              SELECT ROUND(AVG(rating), 2)
              FROM chef_reviews
              WHERE chef_id = ?
            )
        WHERE id = ?
      `,
      [chefId, chefId]
    );

    const created = await query(
      `
        SELECT cr.id, cr.chef_id, cr.customer_id, cr.order_id, cr.rating, cr.review_text, cr.created_at,
               COALESCE(u.name, 'Customer') AS customer_name
        FROM chef_reviews cr
        LEFT JOIN users u ON u.id = cr.customer_id
        WHERE cr.id = ?
        LIMIT 1
      `,
      [result.insertId]
    );

    return res.status(201).json({ success: true, data: created[0] });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = demoChefs.find((item) => Number(item.id) === Number(chefId));
    const demoReviews = demoReviewsByChef[chefId] || [];
    const nextReview = {
      id: Date.now(),
      chef_id: chefId,
      customer_name: "Customer",
      rating: Number(rating),
      review_text: reviewText,
      created_at: new Date().toISOString(),
    };
    demoReviewsByChef[chefId] = [nextReview, ...demoReviews];

    if (chef) {
      const totalRating = demoReviewsByChef[chefId].reduce((sum, review) => sum + Number(review.rating || 0), 0);
      chef.review_count = demoReviewsByChef[chefId].length;
      chef.rating = Number((totalRating / Math.max(1, chef.review_count)).toFixed(2));
    }

    return res.status(201).json({
      success: true,
      data: nextReview,
    });
  }
});

const createHomemadeOrder = asyncHandler(async (req, res) => {
  const chefId = Number(req.params.chefId);
  const userId = Number(req.query.userId || req.body.userId || 0);
  const { items = [], addressId, paymentMethod, deliverySlot = "Lunch", note = "" } = req.body;

  if (!Array.isArray(items) || items.length === 0 || !addressId || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "items, addressId and paymentMethod are required.",
    });
  }

  let chef;
  if (useMongo) {
    chef = await mongoDb().collection("home_chefs").findOne({ id: chefId });
  } else {
    try {
      const chefRows = await query("SELECT id, kitchen_name FROM home_chefs WHERE id = ? LIMIT 1", [chefId]);
      chef = chefRows[0];
    } catch (error) {
      if (!isDbUnavailableError(error)) {
        throw error;
      }
      chef = demoChefs.find((item) => item.id === chefId);
    }
  }

  if (!chef) {
    return res.status(404).json({ success: false, message: "Chef not found." });
  }
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "A valid userId is required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    let subtotal = 0;
    const normalizedItems = [];

    for (const item of items) {
      const menuItemId = Number(item.menuItemId);
      const quantity = Number(item.quantity || 1);
      if (!menuItemId || quantity <= 0) {
        throw new Error("Invalid menu item payload.");
      }

      const menuItem = await db
        .collection("chef_menu_items")
        .findOne({ id: menuItemId, chef_id: chefId, is_available: 1 });

      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found for id ${menuItemId}` });
      }

      subtotal += Number(menuItem.price) * quantity;
      normalizedItems.push({
        menuItemId,
        quantity,
        price: Number(menuItem.price),
        title: menuItem.title,
      });
    }

    const orderId = generateId();
    const orderCode = `HFO-${Date.now()}`;
    const total = subtotal;
    const createdAt = new Date().toISOString();

    const orderDoc = {
      id: orderId,
      order_code: orderCode,
      user_id: userId,
      chef_id: chefId,
      address_id: Number(addressId),
      order_type: "homemade",
      payment_method: paymentMethod,
      subtotal,
      discount: 0,
      total,
      status: "Placed",
      created_at: createdAt,
    };

    await db.collection("orders").insertOne(orderDoc);

    const orderItems = normalizedItems.map((item) => ({
      id: generateId(),
      order_id: orderId,
      meal_id: null,
      menu_item_id: item.menuItemId,
      price: item.price,
      quantity: item.quantity,
    }));
    if (orderItems.length) {
      await db.collection("order_items").insertMany(orderItems);
    }

    await db.collection("order_tracking_events").insertOne({
      id: generateId(),
      order_id: orderId,
      status: "Placed",
      note: note || `Order placed with ${chef.kitchen_name}.`,
      created_at: createdAt,
    });

    await db.collection("delivery_assignments").updateOne(
      { order_id: orderId },
      {
        $set: {
          order_id: orderId,
          partner_name: "Porter Rider",
          partner_phone: "1800-180-1234",
          vehicle_type: "Bike",
          status: "Assigned",
          eta_minutes: 30,
        },
      },
      { upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "Homemade food order created.",
      data: {
        ...orderDoc,
        chef,
        items: normalizedItems,
        delivery: {
          provider: "Porter",
          riderName: "Porter Rider",
          riderPhone: "1800-180-1234",
          vehicleType: "Bike",
          eta: "25-35 min",
          fee: 29,
          orderStatus: "Placed",
          trackingId: orderCode,
        },
      },
    });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let subtotal = 0;
      const normalizedItems = [];

      for (const item of items) {
        const menuItemId = Number(item.menuItemId);
        const quantity = Number(item.quantity || 1);
        if (!menuItemId || quantity <= 0) {
          throw new Error("Invalid menu item payload.");
        }

        const [menuRows] = await conn.execute(
          `
            SELECT id, title, price
            FROM chef_menu_items
            WHERE id = ? AND chef_id = ? AND is_available = 1
            LIMIT 1
          `,
          [menuItemId, chefId]
        );

        const menuItem = menuRows[0];
        if (!menuItem) {
          throw new Error(`Menu item not found for id ${menuItemId}`);
        }

        subtotal += Number(menuItem.price) * quantity;
        normalizedItems.push({
          menuItemId,
          quantity,
          price: Number(menuItem.price),
          title: menuItem.title,
        });
      }

      const orderCode = `HFO-${Date.now()}`;
      const total = subtotal;

      const [orderResult] = await conn.execute(
        `
          INSERT INTO orders (order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status)
          VALUES (?, ?, ?, ?, 'homemade', ?, ?, 0, ?, 'Placed')
        `,
        [orderCode, userId, chefId, addressId, paymentMethod, subtotal, total]
      );

      const orderId = orderResult.insertId;

      for (const item of normalizedItems) {
        await conn.execute(
          `
            INSERT INTO order_items (order_id, meal_id, menu_item_id, price, quantity)
            VALUES (?, NULL, ?, ?, ?)
          `,
          [orderId, item.menuItemId, item.price, item.quantity]
        );
      }

      await conn.execute(
        `
          INSERT INTO order_tracking_events (order_id, status, note)
          VALUES (?, 'Placed', ?)
        `,
        [orderId, note || `Order placed with ${chef.kitchen_name}.`]
      );

      await conn.execute(
        `
          INSERT INTO delivery_assignments (order_id, partner_name, partner_phone, vehicle_type, status, eta_minutes)
          VALUES (?, 'Porter Rider', '1800-180-1234', 'Bike', 'Assigned', 30)
          ON DUPLICATE KEY UPDATE
            partner_name = VALUES(partner_name),
            partner_phone = VALUES(partner_phone),
            vehicle_type = VALUES(vehicle_type),
            status = VALUES(status),
            eta_minutes = VALUES(eta_minutes)
        `,
        [orderId]
      );

      await conn.commit();

      const created = await query(
        `
          SELECT id, order_code, user_id, chef_id, address_id, order_type, payment_method, subtotal, discount, total, status, created_at
          FROM orders
          WHERE id = ?
          LIMIT 1
        `,
        [orderId]
      );

      return res.status(201).json({
        success: true,
        message: "Homemade food order created.",
        data: {
          ...created[0],
          chef,
          items: normalizedItems,
          delivery: {
            provider: "Porter",
            riderName: "Porter Rider",
            riderPhone: "1800-180-1234",
            vehicleType: "Bike",
            eta: "25-35 min",
            fee: 29,
            orderStatus: "Placed",
            trackingId: orderCode,
          },
        },
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const demoOrderId = Date.now();
    const orderCode = `HFO-${demoOrderId}`;
    const fallbackItems = items.map((item) => {
      const chefMenu = (demoMenuByChef[chefId] || []).find((menu) => menu.id === Number(item.menuItemId));
      return {
        menuItemId: Number(item.menuItemId),
        quantity: Number(item.quantity || 1),
        price: chefMenu ? Number(chefMenu.price) : 0,
        title: chefMenu ? chefMenu.title : "Menu Item",
      };
    });

    const subtotal = fallbackItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const demoOrder = {
      id: demoOrderId,
      order_code: orderCode,
      user_id: userId,
      chef_id: chefId,
      address_id: Number(addressId),
      order_type: "homemade",
      payment_method: paymentMethod,
      subtotal,
      discount: 0,
      total: subtotal,
      status: "Placed",
      created_at: new Date().toISOString(),
      customer_name: `Customer ${userId}`,
      item_summary: fallbackItems.map((item) => `${item.title} x${item.quantity}`).join(", "),
      address: "Demo delivery address",
      items: fallbackItems,
    };
    demoHomemadeOrders.unshift(demoOrder);

    return res.status(201).json({
      success: true,
      message: "Homemade food order created in demo mode.",
      data: {
        ...demoOrder,
        chef,
        items: fallbackItems,
        delivery: {
          provider: "Porter",
          riderName: "Porter Rider",
          riderPhone: "1800-180-1234",
          vehicleType: "Bike",
          eta: "25-35 min",
          fee: 29,
          orderStatus: "Placed",
          trackingId: orderCode,
        },
      },
    });
  }
});

const getMyChefProfile = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    return res.json({ success: true, data: chef });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = getDemoChefByUserId(userId);
    return res.json({
      success: true,
      data: {
        ...chef,
        user_id: userId,
        owner_name: chef.chef_name,
        owner_phone: "9876543210",
      },
    });
  }
});

const upsertMyChefProfile = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const {
    chefName,
    kitchenName,
    area,
    city,
    cuisineTag = "Homemade",
    bio = "",
    image_url = null,
  } = req.body;

  if (!chefName || !kitchenName || !area || !city) {
    return res.status(400).json({
      success: false,
      message: "chefName, kitchenName, area and city are required.",
    });
  }

  if (useMongo) {
    const db = mongoDb();
    const existingChef = await getChefByUserId(userId);

    await db.collection("users").updateOne(
      { id: userId },
      { $set: { role: "chef", name: chefName } },
      { upsert: true }
    );

    if (existingChef) {
      await db.collection("home_chefs").updateOne(
        { user_id: userId },
        {
          $set: {
            chef_name: chefName,
            kitchen_name: kitchenName,
            area,
            city,
            cuisine_tag: cuisineTag,
            bio,
            image_url,
          },
        }
      );
    } else {
      await db.collection("home_chefs").insertOne({
        id: generateId(),
        user_id: userId,
        chef_name: chefName,
        kitchen_name: kitchenName,
        area,
        city,
        cuisine_tag: cuisineTag,
        bio,
        rating: 0,
        review_count: 0,
        delivery_time_mins: 30,
        delivery_radius_km: 5,
        veg_only: 0,
        image_url,
        is_active: 1,
      });
    }

    const chef = await getChefByUserId(userId);
    return res.json({ success: true, data: chef });
  }

  try {
    const existingChef = await getChefByUserId(userId);
    await query("UPDATE users SET role = 'chef', name = ? WHERE id = ?", [chefName, userId]);

    if (existingChef) {
      await query(
        `
          UPDATE home_chefs
          SET chef_name = ?, kitchen_name = ?, area = ?, city = ?, cuisine_tag = ?, bio = ?, image_url = ?
          WHERE user_id = ?
        `,
        [chefName, kitchenName, area, city, cuisineTag, bio, image_url, userId]
      );
    } else {
      await query(
        `
          INSERT INTO home_chefs (
            user_id, chef_name, kitchen_name, area, city, cuisine_tag, bio, rating, review_count,
            delivery_time_mins, delivery_radius_km, veg_only, image_url, is_active
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 30, 5, 0, ?, 1)
        `,
        [userId, chefName, kitchenName, area, city, cuisineTag, bio, image_url]
      );
    }

    const chef = await getChefByUserId(userId);
    return res.json({ success: true, data: chef });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    return res.json({
      success: true,
      data: {
        id: getDemoChefByUserId(userId)?.id || userId + 1000,
        user_id: userId,
        chef_name: chefName,
        kitchen_name: kitchenName,
        area,
        city,
        cuisine_tag: cuisineTag,
        bio,
        image_url,
        rating: 0,
        review_count: 0,
        delivery_time_mins: 30,
        delivery_radius_km: 5,
        veg_only: 0,
        is_active: 1,
        owner_name: chefName,
        owner_phone: "9876543210",
      },
    });
  }
});

const getChefDashboard = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const db = mongoDb();
      const orderStatsRows = await db
        .collection("orders")
        .aggregate([
          { $match: { chef_id: chef.id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ])
        .toArray();
      const earningsRows = await db
        .collection("orders")
        .aggregate([
          { $match: { chef_id: chef.id, status: { $nin: ["Rejected"] } } },
          { $group: { _id: null, total_earnings: { $sum: "$total" } } },
        ])
        .toArray();
      const menuCount = await db.collection("chef_menu_items").countDocuments({ chef_id: chef.id });

      const stats = orderStatsRows.reduce(
        (acc, row) => {
          const mapped = parseChefOrderStatus(row._id);
          acc.totalOrders += Number(row.count || 0);
          if (mapped === "Delivered") acc.completedOrders += Number(row.count || 0);
          if (mapped === "Pending") acc.pendingOrders += Number(row.count || 0);
          if (["Accepted", "Preparing", "Shipped", "Out for Delivery"].includes(mapped)) {
            acc.liveOrders += Number(row.count || 0);
          }
          return acc;
        },
        {
          liveOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          totalOrders: 0,
        }
      );

      return res.json({
        success: true,
        data: {
          chef,
          stats: {
            ...stats,
            earnings: Number(earningsRows[0]?.total_earnings || 0),
            rating: Number(chef.rating || 0),
            menuCount: Number(menuCount || 0),
          },
        },
      });
    }

    const [orderStatsRows, earningsRows, menuRows] = await Promise.all([
      query(
        `
          SELECT status, COUNT(*) AS count
          FROM orders
          WHERE chef_id = ?
          GROUP BY status
        `,
        [chef.id]
      ),
      query(
        `
          SELECT COALESCE(SUM(total), 0) AS total_earnings
          FROM orders
          WHERE chef_id = ? AND status NOT IN ('Rejected')
        `,
        [chef.id]
      ),
      query(
        `
          SELECT COUNT(*) AS menu_count
          FROM chef_menu_items
          WHERE chef_id = ?
        `,
        [chef.id]
      ),
    ]);

    const stats = orderStatsRows.reduce(
      (acc, row) => {
        const mapped = parseChefOrderStatus(row.status);
        acc.totalOrders += Number(row.count || 0);
        if (mapped === "Delivered") acc.completedOrders += Number(row.count || 0);
        if (mapped === "Pending") acc.pendingOrders += Number(row.count || 0);
        if (["Accepted", "Preparing", "Shipped", "Out for Delivery"].includes(mapped)) {
          acc.liveOrders += Number(row.count || 0);
        }
        return acc;
      },
      {
        liveOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalOrders: 0,
      }
    );

    return res.json({
      success: true,
      data: {
        chef,
        stats: {
          ...stats,
          earnings: Number(earningsRows[0]?.total_earnings || 0),
          rating: Number(chef.rating || 0),
          menuCount: Number(menuRows[0]?.menu_count || 0),
        },
      },
    });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = getDemoChefByUserId(userId);
    const demoOrders = [
      { status: "Placed" },
      { status: "Accepted" },
      { status: "Preparing" },
    ];
    const stats = demoOrders.reduce(
      (acc, row) => {
        const mapped = parseChefOrderStatus(row.status);
        acc.totalOrders += 1;
        if (mapped === "Pending") acc.pendingOrders += 1;
        if (["Accepted", "Preparing", "Shipped", "Out for Delivery"].includes(mapped)) acc.liveOrders += 1;
        return acc;
      },
      { liveOrders: 0, completedOrders: 18, pendingOrders: 1, totalOrders: 21 }
    );

    return res.json({
      success: true,
      data: {
        chef: {
          ...chef,
          user_id: userId,
          owner_name: chef.chef_name,
          owner_phone: "9876543210",
        },
        stats: {
          ...stats,
          earnings: 18450,
          rating: Number(chef.rating || 0),
          menuCount: (demoMenuByChef[chef.id] || []).length,
        },
      },
    });
  }
});

const listChefOrders = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const db = mongoDb();
      const orders = await db.collection("orders").find({ chef_id: chef.id }).sort({ id: -1 }).toArray();
      const orderIds = orders.map((order) => order.id);
      const items = orderIds.length
        ? await db.collection("order_items").find({ order_id: { $in: orderIds } }).toArray()
        : [];
      const userIds = [...new Set(orders.filter((order) => order.user_id).map((order) => order.user_id))];
      const addressIds = [...new Set(orders.filter((order) => order.address_id).map((order) => order.address_id))];
      const menuItemIds = [...new Set(items.filter((item) => item.menu_item_id).map((item) => item.menu_item_id))];
      const mealIds = [...new Set(items.filter((item) => item.meal_id).map((item) => item.meal_id))];

      const [users, addresses, menuItems, meals] = await Promise.all([
        userIds.length ? db.collection("users").find({ id: { $in: userIds } }).toArray() : [],
        addressIds.length ? db.collection("addresses").find({ id: { $in: addressIds } }).toArray() : [],
        menuItemIds.length ? db.collection("chef_menu_items").find({ id: { $in: menuItemIds } }).toArray() : [],
        mealIds.length ? db.collection("meals").find({ id: { $in: mealIds } }).toArray() : [],
      ]);

      const userMap = Object.fromEntries(users.map((user) => [user.id, user.name]));
      const addressMap = Object.fromEntries(addresses.map((address) => [address.id, address.full_address]));
      const menuItemMap = Object.fromEntries(menuItems.map((item) => [item.id, item.title]));
      const mealMap = Object.fromEntries(meals.map((item) => [item.id, item.title]));

      const itemsByOrder = items.reduce((acc, item) => {
        acc[item.order_id] = acc[item.order_id] || [];
        acc[item.order_id].push(item);
        return acc;
      }, {});

      const data = orders.map((order) => {
        const orderItems = itemsByOrder[order.id] || [];
        const itemSummary = orderItems
          .map((item) => {
            const title = item.menu_item_id
              ? menuItemMap[item.menu_item_id] || mealMap[item.meal_id] || "Item"
              : mealMap[item.meal_id] || "Item";
            return `${title} x${item.quantity}`;
          })
          .join(", ");

        return {
          id: order.id,
          order_code: order.order_code,
          customer_name: userMap[order.user_id] || "Customer",
          item_summary: itemSummary || "Order items",
          status: parseChefOrderStatus(order.status),
          created_at: order.created_at,
          address: addressMap[order.address_id] || "Address unavailable",
          total: Number(order.total || 0),
        };
      });

      return res.json({ success: true, data });
    }

    const rows = await query(
      `
        SELECT
          o.id,
          o.order_code,
          o.status,
          o.total,
          o.created_at,
          a.full_address,
          COALESCE(u.name, 'Customer') AS customer_name,
          GROUP_CONCAT(
            CONCAT(
              COALESCE(cmi.title, m.title, 'Item'),
              ' x',
              oi.quantity
            )
            ORDER BY oi.id SEPARATOR ', '
          ) AS item_summary
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN addresses a ON a.id = o.address_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN chef_menu_items cmi ON cmi.id = oi.menu_item_id
        LEFT JOIN meals m ON m.id = oi.meal_id
        WHERE o.chef_id = ?
        GROUP BY o.id, o.order_code, o.status, o.total, o.created_at, a.full_address, u.name
        ORDER BY o.id DESC
      `,
      [chef.id]
    );

    return res.json({
      success: true,
      data: rows.map((row) => ({
        id: row.id,
        order_code: row.order_code,
        customer_name: row.customer_name,
        item_summary: row.item_summary || "Order items",
        status: parseChefOrderStatus(row.status),
        created_at: row.created_at,
        address: row.full_address || "Address unavailable",
        total: Number(row.total || 0),
      })),
    });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = getDemoChefByUserId(userId);
    const liveDemoOrders = demoHomemadeOrders
      .filter((order) => Number(order.chef_id) === Number(chef.id))
      .map((order) => ({
        id: order.id,
        order_code: order.order_code,
        customer_name: order.customer_name,
        item_summary: order.item_summary || "Order items",
        status: parseChefOrderStatus(order.status),
        created_at: order.created_at,
        address: order.address || "Demo delivery address",
        total: Number(order.total || 0),
      }));

    const sampleOrders = demoChefOrders
      .filter((order) => Number(order.chef_id) === Number(chef.id))
      .map((order) => ({
        ...order,
        status: parseChefOrderStatus(order.status),
      }));

    return res.json({
      success: true,
      data: [
        ...liveDemoOrders,
        ...sampleOrders,
      ],
    });
  }
});

const updateChefOrderStatus = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const orderId = Number(req.params.orderId);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required." });
  }

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const db = mongoDb();
      const order = await db.collection("orders").findOne({ id: orderId, chef_id: chef.id });
      if (!order) {
        return res.status(404).json({ success: false, message: "Chef order not found." });
      }

      const nextStatus = parseChefRouteStatus(status);
      await db.collection("orders").updateOne({ id: orderId }, { $set: { status: nextStatus } });
      await db.collection("order_tracking_events").insertOne({
        id: generateId(),
        order_id: orderId,
        status: nextStatus,
        note: `Chef updated order to ${status}`,
        created_at: new Date().toISOString(),
      });

      if (["Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(nextStatus)) {
        const deliveryStatus =
          nextStatus === "Delivered"
            ? "Delivered"
            : nextStatus === "Out for Delivery"
            ? "On the way"
            : nextStatus === "Shipped"
            ? "Picked up"
            : "Assigned";

        await db.collection("delivery_assignments").updateOne(
          { order_id: orderId },
          {
            $set: {
              order_id: orderId,
              partner_name: "Porter Rider",
              partner_phone: "1800-180-1234",
              vehicle_type: "Bike",
              status: deliveryStatus,
              eta_minutes: 30,
            },
          },
          { upsert: true }
        );
      }

      return res.json({
        success: true,
        message: "Chef order status updated.",
        data: {
          id: orderId,
          status,
        },
      });
    }

    const orderRows = await query(
      `
        SELECT id
        FROM orders
        WHERE id = ? AND chef_id = ?
        LIMIT 1
      `,
      [orderId, chef.id]
    );

    if (!orderRows[0]) {
      return res.status(404).json({ success: false, message: "Chef order not found." });
    }

    const nextStatus = parseChefRouteStatus(status);
    await query("UPDATE orders SET status = ? WHERE id = ?", [nextStatus, orderId]);
    await query(
      `
        INSERT INTO order_tracking_events (order_id, status, note)
        VALUES (?, ?, ?)
      `,
      [orderId, nextStatus, `Chef updated order to ${status}`]
    );

    if (["Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(nextStatus)) {
      const deliveryStatus =
        nextStatus === "Delivered"
          ? "Delivered"
          : nextStatus === "Out for Delivery"
            ? "On the way"
            : nextStatus === "Shipped"
              ? "Picked up"
              : "Assigned";

      await query(
        `
          INSERT INTO delivery_assignments (order_id, partner_name, partner_phone, vehicle_type, status, eta_minutes)
          VALUES (?, 'Porter Rider', '1800-180-1234', 'Bike', ?, 30)
          ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            eta_minutes = VALUES(eta_minutes)
        `,
        [orderId, deliveryStatus]
      );
    }

    return res.json({
      success: true,
      message: "Chef order status updated.",
      data: {
        id: orderId,
        status,
      },
    });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const nextStatus = parseChefRouteStatus(status);
    const demoOrder = demoHomemadeOrders.find((order) => Number(order.id) === Number(orderId));
    if (demoOrder) {
      demoOrder.status = nextStatus;
    }
    const sampleOrder = demoChefOrders.find((order) => Number(order.id) === Number(orderId));
    if (sampleOrder) {
      sampleOrder.status = nextStatus;
    }

    return res.json({
      success: true,
      message: "Chef order status updated in demo mode.",
      data: {
        id: orderId,
        status,
      },
    });
  }
});

const listChefMenu = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const rows = await mongoDb()
        .collection("chef_menu_items")
        .find({ chef_id: chef.id })
        .sort({ id: -1 })
        .toArray();
      return res.json({ success: true, data: rows });
    }

    const rows = await query(
      `
        SELECT id, chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget, is_available
        FROM chef_menu_items
        WHERE chef_id = ?
        ORDER BY id DESC
      `,
      [chef.id]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = getDemoChefByUserId(userId);
    return res.json({ success: true, data: demoMenuByChef[chef.id] || [] });
  }
});

const createChefMenuItem = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const {
    title,
    description = "",
    price,
    category = "General",
    tags = "",
    image_url = null,
    isVeg = true,
    isHealthy = false,
    isTiffin = false,
    isBudget = false,
    isAvailable = true,
  } = req.body;

  if (!title || price === undefined || price === null || Number(price) <= 0) {
    return res.status(400).json({ success: false, message: "title and valid price are required." });
  }

  const imageUrl = getMenuItemImageUrl(req, image_url);
  const isVegBool = parseBoolean(isVeg);
  const isHealthyBool = parseBoolean(isHealthy);
  const isTiffinBool = parseBoolean(isTiffin);
  const isBudgetBool = parseBoolean(isBudget);
  const isAvailableBool = parseBoolean(isAvailable);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const db = mongoDb();
      const menuItemId = generateId();
      const doc = {
        id: menuItemId,
        chef_id: chef.id,
        title,
        description: description || title,
        price: Number(price),
        category,
        tags,
        image_url: imageUrl,
        is_veg: isVegBool ? 1 : 0,
        is_healthy: isHealthyBool ? 1 : 0,
        is_tiffin: isTiffinBool ? 1 : 0,
        is_budget: isBudgetBool ? 1 : 0,
        is_available: isAvailableBool ? 1 : 0,
      };
      await db.collection("chef_menu_items").insertOne(doc);
      return res.status(201).json({ success: true, data: doc });
    }

    const result = await query(
      `
        INSERT INTO chef_menu_items (
          chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget, is_available
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        chef.id,
        title,
        description || title,
        Number(price),
        category,
        tags,
        imageUrl,
        isVegBool ? 1 : 0,
        isHealthyBool ? 1 : 0,
        isTiffinBool ? 1 : 0,
        isBudgetBool ? 1 : 0,
        isAvailableBool ? 1 : 0,
      ]
    );

    const created = await query(
      `
        SELECT id, chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget, is_available
        FROM chef_menu_items
        WHERE id = ?
        LIMIT 1
      `,
      [result.insertId]
    );

    return res.status(201).json({ success: true, data: created[0] });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    const chef = getDemoChefByUserId(userId);
    return res.status(201).json({
      success: true,
      data: {
        id: Date.now(),
        chef_id: chef.id,
        title,
        description: description || title,
        price: Number(price),
        category,
        tags,
        image_url: imageUrl,
        is_veg: isVegBool ? 1 : 0,
        is_healthy: isHealthyBool ? 1 : 0,
        is_tiffin: isTiffinBool ? 1 : 0,
        is_budget: isBudgetBool ? 1 : 0,
        is_available: isAvailableBool ? 1 : 0,
      },
    });
  }
});

const updateChefMenuItem = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const menuItemId = Number(req.params.menuItemId);
  const {
    title,
    description,
    price,
    category,
    tags,
    image_url = null,
    isVeg,
    isHealthy,
    isTiffin,
    isBudget,
    isAvailable,
  } = req.body;

  const imageUrl = getMenuItemImageUrl(req, image_url);
  const isVegBool = isVeg !== undefined ? parseBoolean(isVeg) : undefined;
  const isHealthyBool = isHealthy !== undefined ? parseBoolean(isHealthy) : undefined;
  const isTiffinBool = isTiffin !== undefined ? parseBoolean(isTiffin) : undefined;
  const isBudgetBool = isBudget !== undefined ? parseBoolean(isBudget) : undefined;
  const isAvailableBool = isAvailable !== undefined ? parseBoolean(isAvailable) : undefined;
  const updates = [];
  const params = [];

  if (title !== undefined) {
    updates.push("title = ?");
    params.push(title);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    params.push(description);
  }
  if (price !== undefined && price !== null) {
    updates.push("price = ?");
    params.push(Number(price));
  }
  if (category !== undefined) {
    updates.push("category = ?");
    params.push(category);
  }
  if (tags !== undefined) {
    updates.push("tags = ?");
    params.push(tags);
  }
  if (imageUrl !== null) {
    updates.push("image_url = ?");
    params.push(imageUrl);
  }
  if (isVeg !== undefined) {
    updates.push("is_veg = ?");
    params.push(isVegBool ? 1 : 0);
  }
  if (isHealthy !== undefined) {
    updates.push("is_healthy = ?");
    params.push(isHealthyBool ? 1 : 0);
  }
  if (isTiffin !== undefined) {
    updates.push("is_tiffin = ?");
    params.push(isTiffinBool ? 1 : 0);
  }
  if (isBudget !== undefined) {
    updates.push("is_budget = ?");
    params.push(isBudgetBool ? 1 : 0);
  }
  if (isAvailable !== undefined) {
    updates.push("is_available = ?");
    params.push(isAvailableBool ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided." });
  }

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const db = mongoDb();
      const updateDoc = {};
      if (title !== undefined) updateDoc.title = title;
      if (description !== undefined) updateDoc.description = description;
      if (price !== undefined && price !== null) updateDoc.price = Number(price);
      if (category !== undefined) updateDoc.category = category;
      if (tags !== undefined) updateDoc.tags = tags;
      if (imageUrl !== null) updateDoc.image_url = imageUrl;
      if (isVeg !== undefined) updateDoc.is_veg = isVegBool ? 1 : 0;
      if (isHealthy !== undefined) updateDoc.is_healthy = isHealthyBool ? 1 : 0;
      if (isTiffin !== undefined) updateDoc.is_tiffin = isTiffinBool ? 1 : 0;
      if (isBudget !== undefined) updateDoc.is_budget = isBudgetBool ? 1 : 0;
      if (isAvailable !== undefined) updateDoc.is_available = isAvailableBool ? 1 : 0;

      const result = await db.collection("chef_menu_items").updateOne(
        { id: menuItemId, chef_id: chef.id },
        { $set: updateDoc }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "Menu item not found." });
      }

      const updated = await db.collection("chef_menu_items").findOne({ id: menuItemId, chef_id: chef.id });
      return res.json({ success: true, data: updated });
    }

    await query(
      `
        UPDATE chef_menu_items
        SET ${updates.join(", ")}
        WHERE id = ? AND chef_id = ?
      `,
      [...params, menuItemId, chef.id]
    );

    const rows = await query(
      `
        SELECT id, chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget, is_available
        FROM chef_menu_items
        WHERE id = ? AND chef_id = ?
        LIMIT 1
      `,
      [menuItemId, chef.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    return res.json({
      success: true,
      data: {
        id: menuItemId,
        title,
        description,
        price: price !== undefined ? Number(price) : undefined,
        category,
        tags,
        image_url: imageUrl,
        is_veg: isVeg !== undefined ? (isVegBool ? 1 : 0) : undefined,
        is_healthy: isHealthy !== undefined ? (isHealthyBool ? 1 : 0) : undefined,
        is_tiffin: isTiffin !== undefined ? (isTiffinBool ? 1 : 0) : undefined,
        is_budget: isBudget !== undefined ? (isBudgetBool ? 1 : 0) : undefined,
        is_available: isAvailable !== undefined ? (isAvailableBool ? 1 : 0) : undefined,
      },
    });
  }
});

const deleteChefMenuItem = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const menuItemId = Number(req.params.menuItemId);

  try {
    const chef = await getChefByUserId(userId);
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef profile not found." });
    }

    if (useMongo) {
      const result = await mongoDb()
        .collection("chef_menu_items")
        .updateOne({ id: menuItemId, chef_id: chef.id }, { $set: { is_available: 0 } });

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "Menu item not found." });
      }

      return res.json({ success: true, message: "Menu item deleted.", data: { id: menuItemId } });
    }

    const result = await query(
      `
        UPDATE chef_menu_items
        SET is_available = 0
        WHERE id = ? AND chef_id = ?
      `,
      [menuItemId, chef.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    return res.json({ success: true, message: "Menu item deleted.", data: { id: menuItemId } });
  } catch (error) {
    if (!isDbUnavailableError(error)) {
      throw error;
    }

    return res.json({ success: true, message: "Menu item deleted in demo mode.", data: { id: menuItemId } });
  }
});

module.exports = {
  listHomeChefs,
  getChefById,
  getChefMenu,
  getChefReviews,
  createChefReview,
  createHomemadeOrder,
  getMyChefProfile,
  upsertMyChefProfile,
  getChefDashboard,
  listChefOrders,
  updateChefOrderStatus,
  listChefMenu,
  createChefMenuItem,
  updateChefMenuItem,
  deleteChefMenuItem,
};

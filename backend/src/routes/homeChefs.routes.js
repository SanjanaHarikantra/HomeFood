const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
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
} = require("../controllers/homeChefs.controller");

const uploadDirectory = path.join(__dirname, "..", "..", "uploads", "chef_menu_images");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router({ mergeParams: true });

router.get("/me/:userId/profile", getMyChefProfile);
router.patch("/me/:userId/profile", upsertMyChefProfile);
router.get("/me/:userId/dashboard", getChefDashboard);
router.get("/me/:userId/orders", listChefOrders);
router.patch("/me/:userId/orders/:orderId/status", updateChefOrderStatus);
router.get("/me/:userId/menu", listChefMenu);
router.post("/me/:userId/menu", upload.single("image"), createChefMenuItem);
router.patch("/me/:userId/menu/:menuItemId", upload.single("image"), updateChefMenuItem);
router.delete("/me/:userId/menu/:menuItemId", deleteChefMenuItem);
router.get("/", listHomeChefs);
router.get("/:chefId", getChefById);
router.get("/:chefId/menu", getChefMenu);
router.get("/:chefId/reviews", getChefReviews);
router.post("/:chefId/reviews", createChefReview);
router.post("/:chefId/orders", createHomemadeOrder);

module.exports = router;

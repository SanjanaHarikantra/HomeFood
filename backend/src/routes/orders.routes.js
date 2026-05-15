const express = require("express");
const {
  listOrders,
  placeOrder,
  getOrderTracking,
  updateOrderStatus,
} = require("../controllers/orders.controller");

const router = express.Router({ mergeParams: true });

router.get("/", listOrders);
router.post("/", placeOrder);
router.get("/:orderId/tracking", getOrderTracking);
router.patch("/:orderId/status", updateOrderStatus);

module.exports = router;

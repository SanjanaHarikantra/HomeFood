const express = require("express");
const {
  listPlans,
  createSubscription,
  listUserSubscriptions,
} = require("../controllers/subscriptions.controller");

const router = express.Router({ mergeParams: true });

router.get("/plans", listPlans);
router.get("/", listUserSubscriptions);
router.post("/", createSubscription);

module.exports = router;


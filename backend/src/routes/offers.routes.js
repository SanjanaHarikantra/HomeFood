const express = require("express");
const { listCoupons, applyReferralReward } = require("../controllers/offers.controller");

const router = express.Router({ mergeParams: true });

router.get("/coupons", listCoupons);
router.post("/referral", applyReferralReward);

module.exports = router;


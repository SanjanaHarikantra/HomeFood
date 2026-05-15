const express = require("express");
const { getWallet, addMoney, redeemGold } = require("../controllers/wallet.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getWallet);
router.post("/add-money", addMoney);
router.post("/redeem-gold", redeemGold);

module.exports = router;


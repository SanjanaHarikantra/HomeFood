const express = require("express");
const {
  createPaymentIntent,
  confirmPayment,
} = require("../controllers/payments.controller");

const router = express.Router();

router.post("/create", createPaymentIntent);
router.post("/confirm", confirmPayment);

module.exports = router;

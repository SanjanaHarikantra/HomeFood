const asyncHandler = require("../utils/asyncHandler");

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, provider = "UPI", orderId = null, subscriptionId = null } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "amount is required.",
    });
  }

  const referenceId = `PAY-${Date.now()}`;

  res.status(201).json({
    success: true,
    message: "Payment intent created.",
    data: {
      referenceId,
      amount: Number(amount),
      provider,
      orderId,
      subscriptionId,
      status: "Pending",
      paymentUrl: `https://payments.local/${referenceId}`,
    },
  });
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { referenceId, status = "Success" } = req.body;

  if (!referenceId) {
    return res.status(400).json({
      success: false,
      message: "referenceId is required.",
    });
  }

  res.json({
    success: true,
    message: "Payment confirmation recorded.",
    data: {
      referenceId,
      status,
    },
  });
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
};

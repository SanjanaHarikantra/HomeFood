const express = require("express");
const addressesRoutes = require("./addresses.routes");
const ordersRoutes = require("./orders.routes");
const subscriptionsRoutes = require("./subscriptions.routes");
const walletRoutes = require("./wallet.routes");
const offersRoutes = require("./offers.routes");

const router = express.Router();

router.use("/:userId/addresses", addressesRoutes);
router.use("/:userId/orders", ordersRoutes);
router.use("/:userId/subscriptions", subscriptionsRoutes);
router.use("/:userId/wallet", walletRoutes);
router.use("/:userId/offers", offersRoutes);

module.exports = router;


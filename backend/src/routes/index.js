const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const mealsRoutes = require("./meals.routes");
const usersRoutes = require("./users.routes");
const offersRoutes = require("./offers.routes");
const subscriptionsRoutes = require("./subscriptions.routes");
const homeChefsRoutes = require("./homeChefs.routes");
const paymentsRoutes = require("./payments.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/meals", mealsRoutes);
router.use("/home-chefs", homeChefsRoutes);
router.use("/users", usersRoutes);
router.use("/offers", offersRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/payments", paymentsRoutes);

module.exports = router;

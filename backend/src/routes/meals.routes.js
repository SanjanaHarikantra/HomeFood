const express = require("express");
const { getMeals, getMealById } = require("../controllers/meals.controller");

const router = express.Router();

router.get("/", getMeals);
router.get("/:id", getMealById);

module.exports = router;


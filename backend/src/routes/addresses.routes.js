const express = require("express");
const {
  listAddresses,
  createAddress,
  deleteAddress,
} = require("../controllers/addresses.controller");

const router = express.Router({ mergeParams: true });

router.get("/", listAddresses);
router.post("/", createAddress);
router.delete("/:addressId", deleteAddress);

module.exports = router;


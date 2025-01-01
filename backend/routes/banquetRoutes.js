const express = require("express");
const { registerBanquet } = require("../controllers/banquetController");
const router = express.Router();

// Banquet registration route
router.post("/register", registerBanquet);

module.exports = router;

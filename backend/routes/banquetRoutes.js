const express = require("express");
const { registerBanquet } = require("../controllers/banquetController");
const router = express.Router();

router.post("/register", registerBanquet);

module.exports = router;
const express = require("express");

const router = express.Router();

const { getMenu, createMenu } = require("../controllers/menu");

router.route("/api/menu").get(getMenu);
router.route("/api/menu/:banquetId/:token").get(getMenu);
router.route("/api/menu/:token").post(createMenu);

module.exports = router;

const express = require("express");

const router = express.Router();

const { createContact } = require("../controllers/contact");

router.route("/api/contact").post(createContact);

module.exports = router;
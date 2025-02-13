const express = require("express");

const router = express.Router();

const {
  filterBanquet,
  bookBanquet,
  createReservation,
} = require("../controllers/book");

router.route("/api/filterBanquet").post(filterBanquet);

router
  .route("/api/bookBanquet/:token/:banquetName/:adminUserId/:price")
  .post(bookBanquet);

router.route("/api/createReservation").post(createReservation);

module.exports = router;

//Importing express from package.json
const express = require("express");
const router = express.Router();

//Importing functions from banquet.js.
const {
  getBanquet,
  createBanquet,
  filterBanquetName,
  filterBanquetLocation,
  filterBanquetPrice,
  filterBanquetAscending,
  filterBanquetDescending,
} = require("../controllers/banquet");

//Creating HTTP request methods with express router.
router.route("/api/createBanquet").post(createBanquet);

router.route("/api/getBanquet/:token").get(getBanquet);

router.route("/api/filterBanquetName/:name").get(filterBanquetName);

router.route("/api/filterBanquetLocation/:name").get(filterBanquetLocation);

router.route("/api/filterBanquetPrice/:range").get(filterBanquetPrice);

router.route("/api/filterBanquetAscending").get(filterBanquetAscending);

router.route("/api/filterBanquetDescending").get(filterBanquetDescending);

//Exporting router.
module.exports = router;

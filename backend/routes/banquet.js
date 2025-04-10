import express from "express";
import {
  getBanquet,
  createBanquet,
  filterBanquetName,
  filterBanquetLocation,
  filterBanquetPrice,
  filterBanquetAscending,
  filterBanquetDescending,
  getNearbyBanquets
} from "../controllers/banquet.js";

const router = express.Router();

// Creating HTTP request methods with express router
router.route("/api/createBanquet").post(createBanquet);
router.route("/api/getBanquet/:token").get(getBanquet);
router.route("/api/filterBanquetName/:name").get(filterBanquetName);
router.route("/api/filterBanquetLocation/:name").get(filterBanquetLocation);
router.route("/api/filterBanquetPrice/:range").get(filterBanquetPrice);
router.route("/api/filterBanquetAscending").get(filterBanquetAscending);
router.route("/api/filterBanquetDescending").get(filterBanquetDescending);
router.route("/api/getNearbyBanquets/:lat/:lon").get(getNearbyBanquets);

export default router;
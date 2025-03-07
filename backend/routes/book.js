import express from "express";
import {
  filterBanquet,
  bookBanquet,
  createReservation,
} from "../controllers/book.js";

const router = express.Router();

router.route("/api/filterBanquet").post(filterBanquet);
router
  .route("/api/bookBanquet/:token/:banquetName/:adminUserId/:price")
  .post(bookBanquet);
router.route("/api/createReservation").post(createReservation);

export default router;
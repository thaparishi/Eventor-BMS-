import express from "express";
import {
  filterBanquet,
  bookBanquet,
  createReservation,
  updatePaymentStatus,
  cancelBooking,
  getUserBookings,
  checkBanquetAvailability // Add this import
} from "../controllers/book.js";

const router = express.Router();

// Define all routes properly as strings
router.route("/api/filterBanquet").post(filterBanquet);
router.route("/api/bookBanquet/:token/:banquetName/:adminUserId/:price").post(bookBanquet);
router.route("/api/createReservation").post(createReservation);

// New route for checking banquet availability
router.route("/api/checkBanquetAvailability/:banquetId/:date/:shift").get(checkBanquetAvailability);

// Other booking management routes
router.route("/api/updatePaymentStatus/:bookingId").post(updatePaymentStatus);
router.route("/api/cancelBooking/:bookingId").post(cancelBooking);
router.route("/api/getUserBookings").get(getUserBookings);

export default router;
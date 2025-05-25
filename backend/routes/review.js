import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Import controllers (we'll create these next)
import { 
  submitReview, 
  getAllApprovedReviews, 
  getAllReviews, 
  approveReview, 
  rejectReview,
  deleteReview
} from "../controllers/review.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../frontend/src/Components/review-images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    cb(null, `review-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  }
});

// Public route - Submit a new review (with optional image upload)
router.post("/submit-review", upload.single("image"), submitReview);

// Public route - Get all approved reviews for display on frontend
router.get("/approved-reviews", getAllApprovedReviews);

// Admin routes - These should be protected in production
router.get("/all-reviews", getAllReviews); // Get all reviews (approved and unapproved)
router.patch("/reviews/:id/approve", approveReview); // Approve a review
router.patch("/reviews/:id/reject", rejectReview); // Reject/unapprove a review
router.delete("/reviews/:id", deleteReview); // Delete a review

export default router;
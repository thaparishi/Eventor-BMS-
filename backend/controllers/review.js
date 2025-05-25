import ReviewModel from "../models/review.js";
import reviewRouter from "../routes/review.js";
import path from "path";

// Submit a new review
export const submitReview = async (req, res) => {
  try {
    const { name, title, quote } = req.body;
    
    // Validate required fields
    if (!name || !title || !quote) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, title, and review content" 
      });
    }
    
    // Create review object
    const reviewData = {
      name,
      title,
      quote
    };
    
    // Add image path if an image was uploaded
    if (req.file) {
      // Store only the relative path in the database
      reviewData.image = `/review-images/${path.basename(req.file.path)}`;
    }
    
    // Save review to database (not approved by default)
    const newReview = new ReviewModel(reviewData);
    await newReview.save();
    
    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted for approval.",
      review: newReview
    });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "There was a problem submitting your review. Please try again." 
    });
  }
};

// Get all approved reviews (public endpoint)
export const getAllApprovedReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ isApproved: true })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-__v"); // Exclude version field
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error("Get approved reviews error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch reviews" 
    });
  }
};

// Get all reviews - approved and unapproved (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .sort({ createdAt: -1 }) // Newest first
      .select("-__v");
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch reviews" 
    });
  }
};

// Approve a review (admin only)
export const approveReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved: true },
      { new: true } // Return the updated document
    );
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Review approved successfully",
      review
    });
  } catch (error) {
    console.error("Approve review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to approve review" 
    });
  }
};

// Reject/unapprove a review (admin only)
export const rejectReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved: false },
      { new: true } // Return the updated document
    );
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Review rejected successfully",
      review
    });
  } catch (error) {
    console.error("Reject review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reject review" 
    });
  }
};

// Delete a review (admin only)
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete review" 
    });
  }
};
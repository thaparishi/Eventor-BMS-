import React from "react";
import ReviewForm from "./ReviewForm.jsx";
import "./ReviewPage.css";

function ReviewPage() {
  return (
    <div className="review-page">
      <div className="review-page-header">
        <h1>Share Your Experience</h1>
        <p>We value your feedback and would love to hear about your experience with our services.</p>
      </div>

      <div className="review-page-content">
        <div className="review-info">
          <h2>Why Leave a Review?</h2>
          <ul>
            <li>Help others make informed decisions</li>
            <li>Share your valuable experience</li>
            <li>Help us improve our services</li>
            <li>Become part of our testimonial showcase</li>
          </ul>

          <div className="review-note">
            <h3>Please Note:</h3>
            <p>All reviews are moderated before being published on our website. We appreciate your patience as we review submissions.</p>
          </div>
        </div>

        <div className="form-container">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
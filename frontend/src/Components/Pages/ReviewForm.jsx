import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReviewForm.css";

function ReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    quote: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    title: false,
    quote: false,
    quoteLength: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear validation errors as user types
    if (value.trim() !== '') {
      setValidationErrors({
        ...validationErrors,
        [name]: false,
        // Clear quote length error if quote is long enough
        ...(name === 'quote' && value.length >= 20 ? { quoteLength: false } : {})
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  // Navigate to home page after success message is shown
  useEffect(() => {
    let redirectTimer;
    if (success) {
      redirectTimer = setTimeout(() => {
        navigate("/");  // Navigate to the home page
      }, 5000);
    }
    
    // Clean up timer on component unmount
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [success, navigate]);

  // Validate form before submission
  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      title: formData.title.trim() === '',
      quote: formData.quote.trim() === '',
      quoteLength: formData.quote.trim().length < 20
    };
    
    setValidationErrors(errors);
    
    // Form is valid if no errors are true
    return !Object.values(errors).some(error => error === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create form data to send
      const reviewFormData = new FormData();
      reviewFormData.append("name", formData.name);
      reviewFormData.append("title", formData.title);
      reviewFormData.append("quote", formData.quote);
      
      if (image) {
        reviewFormData.append("image", image);
      }
      
      // Submit to API
      await axios.post("http://localhost:8000/submit-review", reviewFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Include cookies
      });
      
      // Reset form on success
      setFormData({ name: "", title: "", quote: "" });
      setImage(null);
      setPreview(null);
      setSuccess(true);
      
      // Success message will be shown for 5 seconds before redirect (handled by useEffect)
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Share Your Experience</h2>
      <p>We value your feedback! Please leave a review of your experience with us.</p>
      
      {success && (
        <div className="success-message">
          Thank you for your review! It has been submitted for approval.
          <p>You will be redirected to the home page in 5 seconds...</p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={validationErrors.name ? "input-error" : ""}
          />
          {validationErrors.name && (
            <p className="error-text">Name is required</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title/Occupation*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Event Planner, Designer, etc."
            className={validationErrors.title ? "input-error" : ""}
          />
          {validationErrors.title && (
            <p className="error-text">Title/Occupation is required</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="quote">Your Review* (minimum 20 characters)</label>
          <textarea
            id="quote"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            rows="5"
            placeholder="Please share your experience with us..."
            className={validationErrors.quote || validationErrors.quoteLength ? "input-error" : ""}
          />
          {validationErrors.quote && (
            <p className="error-text">Review is required</p>
          )}
          {!validationErrors.quote && validationErrors.quoteLength && (
            <p className="error-text">Review must be at least 20 characters long</p>
          )}
          <div className="character-count">
            {formData.quote.length}/20 minimum characters
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Profile Picture (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
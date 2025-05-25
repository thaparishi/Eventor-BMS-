import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { FaUser, FaCalendarAlt, FaEnvelope, FaLock, FaSpinner, FaTrash, FaTimes } from "react-icons/fa";

function Profile() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [cancelMessage, setCancelMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getUserProfile", {
          withCredentials: true
        });
        if (response.data.success) {
          setUser(prevUser => ({
            ...prevUser,
            name: response.data.user.name,
            email: response.data.user.email
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch user bookings when bookings tab is active
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getUserBookings", {
        withCredentials: true
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (user.newPassword) {
      if (!user.currentPassword) {
        newErrors.currentPassword = "Current password is required to set a new password";
      }
      
      if (user.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      
      if (user.newPassword !== user.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      // Check if password meets requirements (one uppercase, one number, one special character)
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordPattern.test(user.newPassword)) {
        newErrors.newPassword = "Password must contain at least one uppercase letter, one number, and one special character";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updateData = {
        // Only include password fields if the user is trying to change password
        currentPassword: user.currentPassword,
        newPassword: user.newPassword
      };
      
      const response = await axios.post(
        "http://localhost:8000/api/updateUserProfile",
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuccessMessage("Password updated successfully!");
        // Clear password fields
        setUser(prevUser => ({
          ...prevUser,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        setErrors({ form: response.data.message || "Update failed" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ 
        form: error.response?.data?.message || "An error occurred while updating your profile" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Opening the cancel booking modal
  const openCancelModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelConfirmation("");
    setCancelMessage({ type: "", message: "" });
    setShowCancelModal(true);
  };

  // Closing the cancel booking modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelBookingId(null);
    setCancelConfirmation("");
  };

  // Handle the cancel booking process
  const handleCancelBooking = async () => {
    if (cancelConfirmation !== "CANCEL") {
      setCancelMessage({ 
        type: "error", 
        message: "Please type CANCEL to confirm" 
      });
      return;
    }

    setCancelLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:8000/api/cancelBooking/${cancelBookingId}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Close the modal
        setShowCancelModal(false);
        // Show success message
        setCancelMessage({ 
          type: "success", 
          message: response.data.message || "Booking cancelled successfully." 
        });
        // Refresh bookings list
        fetchBookings();
      } else {
        setCancelMessage({ type: "error", message: response.data.message });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelMessage({ 
        type: "error", 
        message: error.response?.data?.message || "An error occurred while cancelling your booking" 
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Helper to safely get status class
  const getStatusClass = (status) => {
    if (!status) return "unknown";
    return status.toLowerCase();
  };

  // Helper to determine if the booking is cancellable
  // Updated to allow cancellation of paid/confirmed bookings
  const isBookingCancellable = (booking) => {
    // Allow cancellation if the booking status is not "cancelled"
    return booking.status !== "cancelled";
  };

  // Clear cancel message after a timeout
  useEffect(() => {
    if (cancelMessage.message) {
      const timer = setTimeout(() => {
        setCancelMessage({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cancelMessage]);

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <FaCalendarAlt /> My Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === "edit-profile" ? "active" : ""}`}
          onClick={() => setActiveTab("edit-profile")}
        >
          <FaUser /> Edit Profile
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === "bookings" && (
          <div className="bookings-tab">
            <h2>My Bookings</h2>
            
            {cancelMessage.message && (
              <div className={`message-banner ${cancelMessage.type}`}>
                {cancelMessage.message}
              </div>
            )}
            
            {isLoading ? (
              <div className="loading-spinner">
                <FaSpinner className="spinner" />
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div className="booking-card" key={booking._id}>
                    <h3 className="banquet-name">{booking.banquetName || "Unnamed Banquet"}</h3>
                    <div className="booking-details">
                      <p><strong>Event Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString() : "Not specified"}</p>
                      <p><strong>Event Type:</strong> {booking.eventType || "Not specified"}</p>
                      <p><strong>Guests:</strong> {booking.guests || "Not specified"}</p>
                      <p>
                        <strong>Status:</strong> 
                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                          {booking.status || "Unknown"}
                        </span>
                      </p>
                      <p>
                        <strong>Payment:</strong> 
                        <span className={`status-badge ${getStatusClass(booking.paymentStatus)}`}>
                          {booking.paymentStatus || "Unknown"}
                        </span>
                      </p>
                    </div>
                    <div className="booking-actions">
                      {isBookingCancellable(booking) && (
                        <button 
                          className="btn-cancel-booking" 
                          onClick={() => openCancelModal(booking._id)}
                        >
                          <FaTrash /> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <p>You don't have any bookings yet.</p>
                <a href="/dbanquet" className="btn-book-now">Browse Banquets</a>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "edit-profile" && (
          <div className="edit-profile-tab">
            <h2>My Account Information</h2>
            
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}
            
            {errors.form && (
              <div className="error-message">
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={user.name} 
                    disabled 
                    className="disabled"
                  />
                </div>
                <p className="helper-text">Username cannot be changed</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={user.email} 
                    disabled
                    className="disabled"
                  />
                </div>
                <p className="helper-text">Email cannot be changed</p>
              </div>
              
              <div className="password-section">
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input 
                      type="password" 
                      id="currentPassword" 
                      name="currentPassword" 
                      value={user.currentPassword} 
                      onChange={handleChange}
                      className={errors.currentPassword ? "error" : ""}
                    />
                  </div>
                  {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input 
                      type="password" 
                      id="newPassword" 
                      name="newPassword" 
                      value={user.newPassword} 
                      onChange={handleChange}
                      className={errors.newPassword ? "error" : ""}
                    />
                  </div>
                  {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
                  <p className="helper-text">Password must contain at least one uppercase letter, one number, and one special character</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      value={user.confirmPassword} 
                      onChange={handleChange}
                      className={errors.confirmPassword ? "error" : ""}
                    />
                  </div>
                  {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner" />
                      Saving...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <h3>Cancel Booking</h3>
              <button className="close-modal" onClick={closeCancelModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <p className="warning-text">Are you sure you want to cancel this booking?</p>
              
              <div className="refund-policy">
                <h4>Refund Policy:</h4>
                <ul>
                  <li>If you haven't paid the booking charge yet, your booking will be cancelled without any charge.</li>
                  <li>If you've already paid the booking charge, only 80% will be refunded.</li>
                  <li>Refunds will be processed within 3 working days.</li>
                </ul>
              </div>
              
              <div className="confirmation-input">
                <label>Please type <strong>CANCEL</strong> to confirm:</label>
                <input
                  type="text"
                  value={cancelConfirmation}
                  onChange={(e) => setCancelConfirmation(e.target.value)}
                  placeholder="Type CANCEL"
                />
              </div>
              
              {cancelMessage.type === "error" && (
                <p className="error-text">{cancelMessage.message}</p>
              )}
              
              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={closeCancelModal}
                >
                  Keep Booking
                </button>
                <button 
                  className="btn-danger" 
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? (
                    <>
                      <FaSpinner className="spinner" />
                      Processing...
                    </>
                  ) : (
                    "Cancel Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
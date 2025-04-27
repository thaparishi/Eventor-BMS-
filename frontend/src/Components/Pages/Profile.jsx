import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { FaUser, FaCalendarAlt, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

function Profile() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

      fetchBookings();
    }
  }, [activeTab]);

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
            
            {isLoading ? (
              <div className="loading-spinner">
                <FaSpinner className="spinner" />
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div className="booking-card" key={booking._id}>
                    <h3 className="banquet-name">{booking.banquetName}</h3>
                    <div className="booking-details">
                      <p><strong>Event Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Event Type:</strong> {booking.eventType}</p>
                      <p><strong>Guests:</strong> {booking.guests}</p>
                      <p><strong>Status:</strong> <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
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
    </div>
  );
}

export default Profile;
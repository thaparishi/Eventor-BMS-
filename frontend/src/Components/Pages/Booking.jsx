import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillCheckCircle } from 'react-icons/ai';
import './BookingSuccess.css'; // Create this CSS file for styling

const Booking = () => {
  const navigate = useNavigate();

  return (
    <div className="booking-success-container">
      <div className="booking-success-popup">
        <div className="success-icon">
          <AiFillCheckCircle size={80} color="#4CAF50" />
        </div>
        
        <h2 className="success-title">Booking Successful!</h2>
        
        <p className="success-message">
          Your booking has been confirmed. Thank you for choosing our service.
        </p>
        
        <div className="booking-details">
          <p><strong>Status:</strong> Paid</p>
        </div>
        
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          Go Back to Home
        </button>
      </div>
    </div> 
  );
};

export default Booking;
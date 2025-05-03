import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './Payment.css';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Extract payment information from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transaction_id') || queryParams.get('txnId');
    const amount = queryParams.get('amount');
    const status = queryParams.get('status');
    
    // Get booking ID from URL params or localStorage
    const id = bookingId || localStorage.getItem('pendingBookingId');
    
    setPaymentData({
      transactionId,
      amount,
      status,
      bookingId: id
    });

    const confirmPayment = async () => {
      try {
        if (!id) {
          setError('No booking information found');
          setLoading(false);
          return;
        }
        
        // Update the payment status in the backend
        const response = await axios.post(`/api/updatePaymentStatus/${id}`, {
          transactionId,
          amount,
          status
        });
        
        if (response.data.success) {
          setSuccess(true);
          // Clear the pending booking ID from localStorage
          localStorage.removeItem('pendingBookingId');
          localStorage.removeItem('paymentAmount');
        } else {
          setError('Failed to confirm payment');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while confirming your payment');
      } finally {
        setLoading(false);
      }
    };
    
    confirmPayment();
  }, [bookingId, location.search]);

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card loading">
          <FaSpinner className="spinner" />
          <h2>Processing Your Payment</h2>
          <p>Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card error">
          <h2>Payment Confirmation Error</h2>
          <p>{error}</p>
          <div className="buttons">
            <button className="btn primary" onClick={goToProfile}>Go to My Bookings</button>
            <button className="btn secondary" onClick={goToHome}>Return to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <FaCheckCircle className="success-icon" />
        <h2>Payment Successful!</h2>
        <p>Your booking has been confirmed. Thank you for your payment.</p>
        {paymentData.transactionId && (
          <div className="payment-details">
            <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
            <p><strong>Amount Paid:</strong> Rs. {parseInt(paymentData.amount)/100}</p>
            <p><strong>Status:</strong> {paymentData.status}</p>
          </div>
        )}
        <div className="buttons">
          <button className="btn primary" onClick={goToProfile}>View My Bookings</button>
          <button className="btn secondary" onClick={goToHome}>Return to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
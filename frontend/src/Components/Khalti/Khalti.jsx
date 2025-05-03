import React, { useState } from "react";
import axios from "axios";

const Khalti = ({ payment, bookingId }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async () => {
    setIsProcessing(true);
    
    try {
      const bookingCharge = Math.round(payment * 0.15);
      
      const data = {
        // Using lowercase 'booking' to match the route in App.js
        return_url: `http://localhost:3000/booking/${bookingId}`,
        website_url: "http://localhost:3000/",
        amount: bookingCharge * 100, 
        purchase_order_id: bookingId || "test12",
        purchase_order_name: "Booking Charge",
        customer_info: {
          name: "Rishi Thapa",
          email: "Rishithpa@gmail.com",
          phone: "9813444724",
        },
        amount_breakdown: [
          {
            label: "Booking Charge (15%)",
            amount: bookingCharge * 100,
          },
        ],
        product_details: [
          {
            identity: bookingId || "1234567890",
            name: "Banquet Booking",
            total_price: bookingCharge * 100,
            quantity: 1,
            unit_price: bookingCharge * 100,
          },
        ],
      };

      const headers = {
        Authorization: "Key 16bb4feb81bd44ebb24647ca20421670",
      };

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        { headers }
      );
      
      // Store booking ID in local storage to use on return
      localStorage.setItem('pendingBookingId', bookingId);
      
      // Also store transaction data from the request for verification
      localStorage.setItem('paymentAmount', bookingCharge * 100);
      
      // Immediately redirect to payment URL
      window.location.href = response.data.payment_url;
      
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        style={{
          backgroundColor: "purple",
          padding: "15px 40px",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          border: "1px solid white",
          borderRadius: "5px",
        }}
        onClick={initiatePayment}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Booking Charge (15%)"}
      </button>
    </div>
  );
};

export default Khalti;
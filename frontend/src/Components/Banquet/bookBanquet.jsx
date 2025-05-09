import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./bookBanquet.css";

const BookBanquet = () => {
  const navigate = useNavigate();
  const { banquetId, banquetName, banquetPrice } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dateAvailability, setDateAvailability] = useState({
    isAvailable: true,
    message: ""
  });

  const [reservationData, setReservationData] = useState({
    shift: "",
    date: "",
    type: "",
    guest: "",
    banquetId: banquetId,
    banquetName: banquetName,
    banquetPrice: banquetPrice
  });

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!reservationData.shift) {
      newErrors.shift = "Please select a shift";
    }
    
    if (!reservationData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(reservationData.date);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.date = "Date must be at least tomorrow";
      }
    }
    
    if (!reservationData.guest) {
      newErrors.guest = "Please enter number of guests";
    } else if (parseInt(reservationData.guest) <= 0) {
      newErrors.guest = "Number of guests must be positive";
    } else if (parseInt(reservationData.guest) > 5000) {
      newErrors.guest = "Maximum guests allowed is 5000";
    }
    
    if (!reservationData.type) {
      newErrors.type = "Please select an event type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReservationData({ ...reservationData, [name]: value });
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Check date availability when date or shift changes
    if (name === "date" || (name === "shift" && reservationData.date)) {
      checkDateAvailability(name === "date" ? value : reservationData.date, name === "shift" ? value : reservationData.shift);
    }
  };

  // Function to check date availability
  const checkDateAvailability = async (date, shift) => {
    if (!date || !shift) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/checkBanquetAvailability/${banquetId}/${date}/${shift}`);
      
      if (response.data.isAvailable) {
        setDateAvailability({
          isAvailable: true,
          message: ""
        });
      } else {
        setDateAvailability({
          isAvailable: false,
          message: response.data.message || "This banquet is not available on the selected date and shift. It's already booked for another event."
        });
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setDateAvailability({
        isAvailable: true, // Default to available in case of error
        message: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check availability one more time before submitting
    if (!dateAvailability.isAvailable) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post("/api/createReservation", reservationData);

      if (response.data.Sucess === "Unsucessfull") {
        setErrors({ form: "Please fill all required fields properly" });
      } else if (response.data.Sucess === "Sucess") {
        setIsOpen(true);
        // Generate token with reservation info
        const token = response.data.data;
        navigateToMenu(token);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  function navigateToMenu(token) {
    setTimeout(() => {
      navigate(`/DisplayMenu/${banquetId}/${token}/${banquetName}/${banquetPrice}`);
    }, 2000);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (errors.form) {
        setErrors({ ...errors, form: "" });
      }
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [errors]);

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <main>
      <div className="book-banquets-container">
        <section className="book-banquet-content">
          <section className="book-banquet-heading">
            <h2>Book {banquetName}</h2>
            <p>Price per plate: Rs. {banquetPrice}</p>
          </section>

          <form className="book-banquet-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <select 
                name="shift" 
                value={reservationData.shift} 
                onChange={handleChange} 
                className={errors.shift ? "input-error" : ""}
                required
              >
                <option value="" disabled>Select Shift</option>
                <option value="whole day">Whole day</option>
                <option value="evening">Evening</option>
              </select>
              {errors.shift && <span className="error-message">{errors.shift}</span>}
            </div>

            <div className="form-group">
              <input
                type="date"
                id="date"
                name="date"
                placeholder="Select Date"
                min={getTomorrowDate()}
                value={reservationData.date}
                onChange={handleChange}
                className={errors.date ? "input-error" : ""}
                required
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
              {!errors.date && !dateAvailability.isAvailable && (
                <span className="availability-message">{dateAvailability.message}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="number"
                id="guest"
                name="guest"
                placeholder="Number of Guests"
                max="5000"
                min="1"
                value={reservationData.guest}
                onChange={handleChange}
                className={errors.guest ? "input-error" : ""}
                required
              />
              {errors.guest && <span className="error-message">{errors.guest}</span>}
            </div>

            <div className="form-group">
              <select 
                name="type" 
                value={reservationData.type} 
                onChange={handleChange} 
                className={errors.type ? "input-error" : ""}
                required
              >
                <option value="" disabled>Event Type</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="corporate event">Corporate Event</option>
                <option value="other">Other</option>
              </select>
              {errors.type && <span className="error-message">{errors.type}</span>}
            </div>
            
            <button 
              className="online-booking-btn" 
              disabled={isLoading || !dateAvailability.isAvailable}
            >
              {isLoading ? "Processing..." : "Continue to Menu Selection"}
            </button>
            
            {errors.form && <p className="error-message form-error">{errors.form}</p>}
          </form>
        </section>
        
        {isOpen && (
          <div className="sucess-popUp">
            <article className="pop-up-message">
              <p>Reservation confirmed! Proceeding to menu selection...</p>
              <button
                className="X"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                X
              </button>
            </article>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookBanquet;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./bookBanquet.css";

const BookBanquet = () => {
  const navigate = useNavigate();
  const { banquetId, banquetName, banquetPrice } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [unSucessfull, setUnsucessfull] = useState(false);

  const [reservationData, setReservationData] = useState({
    shift: "",
    date: "",
    type: "",
    guest: "",
    banquetId: banquetId,
    banquetName: banquetName,
    banquetPrice: banquetPrice
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "/api/createReservation",
      reservationData
    );

    if (response.data.Sucess === "Unsucessfull") {
      setUnsucessfull(true);
    } else if (response.data.Sucess === "Sucess") {
      setIsOpen(true);
      // Generate token with reservation info
      const token = response.data.data;
      navigateToMenu(token);
    }
  };

  function navigateToMenu(token) {
    setTimeout(() => {
      // Make sure you're using banquetId instead of userId in the URL
      navigate(`/DisplayMenu/${banquetId}/${token}/${banquetName}/${banquetPrice}`);
    }, 2000);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setUnsucessfull(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [unSucessfull]);

  return (
    <main>
      <div className="book-banquets-container">
        <section className="book-banquet-content">
          <section className="book-banquet-heading">
            <h2>Book {banquetName}</h2>
            <p>Price per plate: Rs. {banquetPrice}</p>
          </section>

          <form className="book-banquet-form" onSubmit={handleSubmit}>
            <select name="shift" value={reservationData.shift} onChange={handleChange} required>
              <option value="" disabled>Shift</option>
              <option value="whole day">Whole day</option>
              <option value="evening">Evening</option>
            </select>

            <input
              type="date"
              id="date"
              name="date"
              placeholder="date"
              min={(function () {
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split("T")[0];
              })()}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />

            <input
              type="number"
              id="guest"
              name="guest"
              placeholder="Guest"
              max="5000"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />

            <select name="type" value={reservationData.type} onChange={handleChange} required>
              <option value="" disabled>Type</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="corporate event">Corporate Event</option>
              <option value="other">Other</option>
            </select>
            <button className="online-booking-btn">Continue to Menu Selection</button>
            {unSucessfull && (
              <p style={{ color: "red" }}>Please fill form properly</p>
            )}
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
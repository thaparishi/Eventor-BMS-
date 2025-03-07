import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./bookBanquet.css";

const BookBanquet = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [unSucessfull, setUnsucessfull] = useState(false);

  const [reservationData, setReservationData] = useState({
    shift: "",
    date: "",
    type: "",
    guest: "",
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
      navigateFun(response.data.data);
    }
  };

  function navigateFun(data) {
    setTimeout(() => {
      navigate(`/banquet/${data}`);
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
            <h2>Book now</h2>
          </section>

          <form className="book-banquet-form" onSubmit={handleSubmit}>
            <select
              name="shift"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <option value="" disabled selected>
                Shift
              </option>
              <option value="whole day">Whole day</option>
              <option value="whole day">Evening </option>
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

            <select
              name="type"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <option value="" disabled selected>
                Type
              </option>
              <option value="weeding">Weeding</option>
              <option value="anniversary">Anniversary</option>
              <option value="corporate event">Corporate Event</option>
              <option value="other">Other</option>
            </select>
            <button className="online-booking-btn">Online Booking</button>
            {unSucessfull && (
              <p style={{ color: "red" }}>Please fill form properly</p>
            )}
          </form>
        </section>
        {isOpen && (
          <div className="sucess-popUp">
            <article className="pop-up-message">
              <p>Searching for Best Banquet</p>
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
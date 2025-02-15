import React, { useState } from "react";

import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";


import "./Contact.css";

const Contact = () => {
  const [isOpen] = useState(false);
  
  return (
    <div className=" boddy">
      <div className="contact-page-container">
        <section className="left-side-contact-page">
          <article className="contact-page-heading">
            <h2>Please feel free to contact us for any queries</h2>
          </article>
          <article className="contact-page-social-links">
            <AiFillFacebook />
            <AiFillTwitterCircle />
            <AiFillInstagram />
            <AiFillLinkedin />
          </article>
        </section>
        <section className="right-side-contact-page">
          <form className="contact-page-form">
            <input
              type="text"
              className="name"
              name="name"
              placeholder="Name Eg. Rishi"
              value={""}
              onChange={(e) => {
              }}
            />
            <input
              type="email"
              id="gmail"
              name="gmail"
              placeholder="Email Eg. rishithapa@gmail.com"
              value={""}
              onChange={(e) => {
              }}
            />
            <input
              type="tel"
              id="number"
              name="number"
              placeholder="Number"
              onChange={(e) => {
              }}
              pattern="[0-9]{10,}"
              title="Phone number must contain at least 10 digits."
              minlength="10"
              required
            />

            <select
              name="to"
              value={""}
              onChange={(e) => {
              }}
            >
              <option value="" disabled selected>
                For
              </option>
              <option value="Banquet Booking">Banquet Booking</option>
              <option value="Banquet Owner">Banquet Owner</option>
            </select>

            <textarea
              id="comment"
              name="comment"
              rows="4"
              cols="50"
              placeholder="Your Message or Queries"
              value={""}
              onChange={(e) => {
              }}
            ></textarea>
            <button
              className="contact-page-btn"
              type="submit"
              onClick={(e) => {
              }}
            >
              Submit
            </button>
          </form>
        </section>
        {isOpen && (
          <div className="sucess-popUp">
            <article className="pop-up-message">
              <p>Sucessfully Submitted</p>
              <button
                className="X"
                onClick={() => {
                }}
              >
                X
              </button>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

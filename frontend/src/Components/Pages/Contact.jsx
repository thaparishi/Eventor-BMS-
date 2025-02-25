import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";

import axios from "axios";

import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [contactData, setContactData] = useState({
    name: "",
    gmail: "",
    number: "",
    to: "",
    comment: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContactData({ ...contactData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/contact", contactData);
    console.log(response.data);
    if (response.data === "successfull") {
      setIsOpen(true);
      nagivate();
    } else {
      setIsOpen(false);
    }
  };

  const nagivate = () => {
    setTimeout(() => {
      setIsOpen(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="boddy">
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
            value={contactData.name}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="email"
            id="gmail"
            name="gmail"
            placeholder="Email Eg. rishithpa@gmail.com"
            value={contactData.gmail}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="tel"
            id="number"
            name="number"
            placeholder="Number"
            onChange={(e) => {
              handleChange(e);
            }}
            pattern="[0-9]{10,}"
            title="Phone number must contain at least 10 digits."
            minlength="10"
            required
          />

          <select
            name="to"
            value={contactData.to}
            onChange={(e) => {
              handleChange(e);
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
            value={contactData.comment}
            onChange={(e) => {
              handleChange(e);
            }}
          ></textarea>
          <button
            className="contact-page-btn"
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
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
                setIsOpen(false);
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

import React, { useState } from "react";
import { 
  AiFillFacebook, 
  AiFillTwitterCircle, 
  AiFillInstagram, 
  AiFillLinkedin 
} from "react-icons/ai";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    gmail: "",
    number: "",
    to: "",
    comment: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/contact", contactData);
    
    if (response.data === "successful") {
      setIsOpen(true);
      // Reset form fields
      setContactData({
        name: "",
        gmail: "",
        number: "",
        to: "",
        comment: "",
      });
    }
  } catch (error) {
    console.error("Submission failed:", error);
    setIsOpen(false);
  }
};


  return (
    <div className="boddy">
      <div className="contact-page-container">
        {/* Left Section */}
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

        {/* Right Section */}
        <section className="right-side-contact-page">
          <form className="contact-page-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="name"
              name="name"
              placeholder="Name Eg. Rishi"
              value={contactData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="gmail"
              placeholder="Email Eg. rishithpa@gmail.com"
              value={contactData.gmail}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="number"
              placeholder="Number"
              value={contactData.number}
              onChange={handleChange}
              pattern="[0-9]{10,}"
              title="Phone number must contain at least 10 digits."
              required
            />

            <select
              name="to"
              value={contactData.to}
              onChange={handleChange}
              required
            >
              <option value="" disabled>For</option>
              <option value="Banquet Booking">Banquet Booking</option>
              <option value="Banquet Owner">Banquet Owner</option>
            </select>

            <textarea
              name="comment"
              placeholder="Your Message or Queries"
              value={contactData.comment}
              onChange={handleChange}
              required
            ></textarea>

            <button className="contact-page-btn" type="submit">
              Submit
            </button>
          </form>
        </section>

        {/* Success Popup */}
        {isOpen && (
          <div className="success-popUp">
            <article className="pop-up-message">
              <p>Successfully Submitted</p>
              <button
                className="X"
                onClick={() => setIsOpen(false)}
                aria-label="Close notification"
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
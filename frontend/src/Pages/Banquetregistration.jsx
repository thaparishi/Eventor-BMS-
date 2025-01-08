import React, { useState } from "react";
import axios from "axios";
import "./Banquetregistration.css";

const BanquetRegistration = () => {
  const [banquet, setBanquet] = useState({
    name: "",
    location: "",
    contact: "",
    capacity: "",
    price: "",
    description: "",
  });

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    success: false,
    error: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanquet({ ...banquet, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/banquet/register", banquet);
      
      if (response.data.success) {
        setResponseMessage({
          msg: "Banquet registered successfully!",
          success: true,
          error: false,
        });
        setBanquet({
          name: "",
          location: "",
          contact: "",
          capacity: "",
          price: "",
          description: "",
        });
      } else {
        setResponseMessage({
          msg: "Failed to register banquet. Please try again.",
          success: false,
          error: true,
        });
      }
    } catch (error) {
      setResponseMessage({
        msg: "An error occurred. Please try again.",
        success: false,
        error: true,
      });
    }
  };

  return (
    <div className="fullb">
        <div className="banquet-registration-container">
        <h1>Register Your Banquet</h1>
        <form onSubmit={handleSubmit} className="banquet-registration-form">
            <div className="form-field">
            <label htmlFor="name">Banquet Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={banquet.name}
                onChange={handleChange}
                placeholder="Enter banquet name"
                required
            />
            </div>

            <div className="form-field">
            <label htmlFor="location">Location</label>
            <input
                type="text"
                id="location"
                name="location"
                value={banquet.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
            />
            </div>

            <div className="form-field">
            <label htmlFor="contact">Contact Number</label>
            <input
                type="text"
                id="contact"
                name="contact"
                value={banquet.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
            />
            </div>

            <div className="form-field">
            <label htmlFor="capacity">Capacity</label>
            <input
                type="number"
                id="capacity"
                name="capacity"
                value={banquet.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                required
            />
            </div>

            <div className="form-field">
            <label htmlFor="price">Price</label>
            <input
                type="number"
                id="price"
                name="price"
                value={banquet.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
            />
            </div>

            <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={banquet.description}
                onChange={handleChange}
                placeholder="Enter a brief description"
                required
            />
            </div>

            <button type="submit" className="submit-button">
            Register Banquet
            </button>

            {responseMessage.success && <p className="success-message">{responseMessage.msg}</p>}
            {responseMessage.error && <p className="error-message">{responseMessage.msg}</p>}
        </form>
        </div>
    </div>
  );
};

export default BanquetRegistration;

import React, { useEffect, useState } from "react";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Khalti from "../Khalti/Khalti";
import axios from "axios";
import "./displayMenu.css";

const DisplayMenu = () => {
  const { userId, banquetId, token, banquetName, banquetPrice } = useParams();

  const [menuData, setMenuData] = useState([]);
  const [price, setPrice] = useState(null);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [desert, setDesert] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  let adminUserId;

  const [isOpen, setIsOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    sucess: false,
    unSucess: false,
  });

  const handleChange = (e) => {
    const value = e.target.value;

    if (e.target.name === "breakfast") {
      if (e.target.checked) {
        setBreakfast([...breakfast, value]);
      } else {
        const index = breakfast.indexOf(value);
        if (index !== -1) {
          const newBreakfast = [...breakfast];
          newBreakfast.splice(index, 1);
          setBreakfast(newBreakfast);
        }
      }
    } else if (e.target.name === "dinner") {
      if (e.target.checked) {
        setLunch([...lunch, value]);
      } else {
        const index = lunch.indexOf(value);
        if (index !== -1) {
          const newLunch = [...lunch];
          newLunch.splice(index, 1);
          setLunch(newLunch);
        }
      }
    } else if (e.target.name === "desert") {
      if (e.target.checked) {
        setDesert([...desert, value]);
      } else {
        const index = desert.indexOf(value);
        if (index !== -1) {
          const newDesert = [...desert];
          newDesert.splice(index, 1);
          setDesert(newDesert);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const menuData = { breakfast: breakfast, lunch: lunch, desert: desert };
    const response = await axios.post(
      `/api/bookBanquet/${token}/${banquetName}/${adminUserId || "admin"}/${price || 0}`,
      menuData
    );
    console.log(response.data);
    if (response.data === "Sucess") {
      // Get the booking ID from the latest booking
      try {
        const bookingsResponse = await axios.get("/api/getUserBookings", {
          withCredentials: true
        });
        if (bookingsResponse.data.success && bookingsResponse.data.bookings.length > 0) {
          // Assume the latest booking is the first in the array (sorted by date)
          setBookingId(bookingsResponse.data.bookings[0]._id);
        }
      } catch (err) {
        console.error("Error fetching booking ID:", err);
      }

      setResponseMessage({
        msg: "Successfully Booked the Banquet, Please Proceed to Payment",
        sucess: true,
      });
      setTimeout(() => {
        setIsOpen(true);
      }, 2000);
    } else if (response.data === "Unsucessfull") {
      setResponseMessage({
        msg: "Unsuccessful, Please Check Empty Fields",
        unSucess: true,
      });
    }
  };

  useEffect(() => {
    const fetchMenuData = async (e) => {
      const menu = await axios.get(`/api/menu/${banquetId}/${token}`);
      setMenuData([menu.data.data]);
      setPrice(parseInt(menu.data.price) * parseInt(banquetPrice));
    };
    fetchMenuData();
  }, [userId, token, banquetId, banquetPrice]);

  useEffect(() => {
    const Timer = setTimeout(() => {
      setResponseMessage({ msg: "", unSucess: false, sucess: false });
    }, 2000);
    
    return () => {
      clearTimeout(Timer);
    };
  }, [responseMessage]);

  const closePaymentModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="boody">
      <form onSubmit={handleSubmit}>
        {menuData.map((item) => {
          const { userId, breakfast, desert, dinner, price } = item;
          adminUserId = userId;
          return (
            <React.Fragment key={userId}>
              <div className="menu-price">
                <div>
                  <h2>Our Menu</h2>
                </div>

                <div className="menu-underline"></div>
                <div>
                  <p>Maximum Capacity {price}</p>
                </div>
              </div>
              <div className="menu">
                <div className="form-menus">
                  <div className="heading-menu">
                    <h2>STARTERS</h2>
                  </div>

                  <div className="menu-items">
                    <div className="menu-content-form">
                      {breakfast.map((item, index) => {
                        return (
                          <div key={index} className="display-all-menu">
                            <div className="breakfast-image">
                              <img
                                src={require("../Images/menu/breakfast.jpg")}
                                alt=""
                              />
                            </div>
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`breakfast-${index}`}
                                  name="breakfast"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor={`breakfast-${index}`}>{item}</label>
                                <br />
                              </div>
                              <div className="underline-dotted"></div>
                              <div className="menu-text">
                                <p>
                                  The starter, also known as the appetizer, is a
                                  small dish served before the main course to
                                  stimulate the appetite.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-menus">
                  <div className="heading-menu">
                    <h2>MAINCOURSE</h2>
                  </div>
                  <div className="menu-items">
                    <div className="menu-content-form">
                      {dinner.map((item, index) => {
                        return (
                          <div key={index} className="display-all-menu">
                            <div className="breakfast-image">
                              <img
                                src={require("../Images/menu/breakfast.jpg")}
                                alt=""
                              />
                            </div>
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`dinner-${index}`}
                                  name="dinner"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor={`dinner-${index}`}>{item}</label>
                                <br />
                              </div>
                              <div className="underline-dotted"></div>
                              <div className="menu-text">
                                <p>
                                  The main course is the featured or primary dish in a meal
                                  consisting of several courses. It is the most substantial
                                  course of the meal.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-menus">
                  <div className="heading-menu">
                    <h2>DESSERTS</h2>
                  </div>
                  <div className="menu-items">
                    <div className="menu-content-form">
                      {desert.map((item, index) => {
                        return (
                          <div key={index} className="display-all-menu">
                            <div className="breakfast-image">
                              <img
                                src={require("../Images/menu/breakfast.jpg")}
                                alt=""
                              />
                            </div>
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`desert-${index}`}
                                  name="desert"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor={`desert-${index}`}>{item}</label>
                                <br />
                              </div>
                              <div className="underline-dotted"></div>
                              <div className="menu-text">
                                <p>
                                  Dessert is the sweet course eaten at the end of a meal,
                                  such as cake, pastry, ice cream, pudding, or fruit.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div className="book-form-btn">
          <button type="submit">Book Now</button>
        </div>
      </form>

      <div className="sucess-message">
        {responseMessage.sucess && (
          <div className="sucess-message-inner">
            <AiFillCheckCircle className="sucess-message-icon" />
            <h3>{responseMessage.msg}</h3>
          </div>
        )}
        {responseMessage.unSucess && (
          <div className="unsucess-message-inner">
            <AiOutlineCloseCircle className="unsucess-message-icon" />
            <h3>{responseMessage.msg}</h3>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <div className="payment-modal-header">
              <h2>Payment Details</h2>
              <span className="close" onClick={closePaymentModal}>&times;</span>
            </div>
            <div className="payment-modal-body">
              <p>Total Amount: Rs. {price}</p>
              <p>Booking ID: {bookingId || "Loading..."}</p>
              <p>Please note: A 15% booking charge will be collected now to confirm your reservation.</p>
              <div className="payment-buttons">
                <Khalti payment={price} bookingId={bookingId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;
import React, { useEffect, useState } from "react";

import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { useParams } from "react-router-dom";

import Khalti from "../Khalti/Khalti";

import axios from "axios";

import "./displayMenu.css";

const DisplayMenu = () => {
  const { userId, token, banquetName, banquetPrice } = useParams();

  const [menuData, setMenuData] = useState([]);

  const [price, setPrice] = useState(null);

  const [breakfast, setBreakfast] = useState([]);

  const [lunch, setLunch] = useState([]);

  const [desert, setDesert] = useState([]);

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
      `/api/bookBanquet/${token}/${banquetName}/${adminUserId}/${price}`,
      menuData
    );
    console.log(response.data);
    if (response.data === "Sucess") {
      setResponseMessage({
        msg: "Sucessfully, Booked the Banquet, Please Proceed to Payment",
        sucess: true,
      });
      setTimeout(() => {
        setIsOpen(true);
      }, 2000);
    } else if (response.data === "Unsucessfull") {
      setResponseMessage({
        msg: "UnSucessfull, Please Check Empty Fields",
        unSucess: true,
      });
    }
  };

  useEffect(() => {
    const fetchMenuData = async (e) => {
      const menu = await axios.get(`/api/menu/${userId}/${token}`);
      setMenuData([menu.data.data]);
      setPrice(parseInt(menu.data.price) * parseInt(banquetPrice));
    };
    fetchMenuData();
  }, [userId, token]);

  useEffect(() => {
    const Timer = setTimeout(() => {
      setResponseMessage({ msg: "", unSucess: false, sucess: false });
    }, 2000);
    
    return () => {
      clearTimeout(Timer);
    };
  }, [responseMessage]);

  return (
    <div className="boody">
      <form onSubmit={handleSubmit}>
        {menuData.map((item) => {
          const { userId, breakfast, desert, dinner, price } = item;
          adminUserId = userId;
          return (
            <>
              <div className="menu-price">
                <div>
                  <h2>Our Menu</h2>
                </div>

                <div className="menu-underline"></div>
                <div>
                  <p>Maximum Capacity {price}</p>
                </div>
              </div>
              <div className="menu" key={userId}>
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
                                  id={item}
                                  name="breakfast"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor="breakfast">{item}</label>
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
                                src={require("../Images/menu/dinner.jpg")}
                                alt=""
                                width="500"
                              />
                            </div>
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={item}
                                  name="dinner"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor="dinner">{item}</label>
                                <br />
                              </div>
                              <div className="underline-dotted"></div>
                              <div className="menu-text">
                                <p>
                                  The main course, also known as the entree, is
                                  the central dish of the meal, usually
                                  consisting of a protein source.
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
                    <h2>DESSERT</h2>
                  </div>

                  <div className="menu-items">
                    <div className="menu-content-form">
                      {desert.map((item, index) => {
                        return (
                          <div key={index} className="display-all-menu">
                            <div className="breakfast-image">
                              <img
                                src={require("../Images/menu/dinner.jpg")}
                                alt=""
                                width="500"
                              />
                            </div>
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={item}
                                  name="desert"
                                  value={item}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                                <label htmlFor="desert">{item}</label>
                                <br />
                              </div>
                              <div className="underline-dotted"></div>
                              <div className="menu-text">
                                <p>
                                  Dessert is a sweet dish, often served at the
                                  end of the meal, which may include fruit,
                                  cakes, pastries, ice cream.
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
            </>
          );
        })}
        <button
          className={
            isOpen ? "submit-menu-btn display-none" : "submit-menu-btn"
          }
          type="submit"
        >
          Submit Menu
        </button>
      </form>
      {isOpen && (
        <div className="display-menu-modal">
          <div className="display-modal">
          <article className="Calculated-Price">
            <p>
              <b>Total Cost: </b>Rs. {price}
            </p>
            <p>
              <b>Booking Charge (15%): </b>Rs. {Math.round(price * 0.15)}
            </p>
          </article>
            <article className="PayNow">
              <Khalti payment={price} />
            </article>
            <article className="back-to-home-pg">
              <a href="/" style={{ fontSize: "15px" }}>
                {" "}   
                Back to Home
              </a>
            </article>
          </div>
        </div>
      )}

      {responseMessage.sucess && (
        <>
          <article className="pop-up">
            <AiFillCheckCircle size={100} color="lime" />
            <h2>{responseMessage.msg}.</h2>
          </article>
        </>
      )}
      {responseMessage.unSucess && (
        <>
          <article
            className="pop-up"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              flexDirection: "column",
            }}
          >
            <AiOutlineCloseCircle size={100} color="red" />
            <h2 style={{ color: "red" }}>{responseMessage.msg}</h2>
          </article>
        </>
      )}
    </div>
  );
};

export default DisplayMenu;
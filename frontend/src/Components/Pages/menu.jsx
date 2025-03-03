import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";


import "./menu.css";

const Menu = () => {
  let { token } = useParams();

  const [breakfast, setbreakFast] = useState([]);

  const [dinner, setDinner] = useState([]);

  const [desert, setDesert] = useState([]);

  const [pricePerPlate, setpricePerPlate] = useState();

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    sucess: false,
    unSucess: false,
  });

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    if (e.target.name === "breakfast") {
      const inputData = [...breakfast];
      inputData[index] = e.target.value;
      setbreakFast(inputData);
    } else if (e.target.name === "dinner") {
      const inputData = [...dinner];
      inputData[index] = e.target.value;
      setDinner(inputData);
    } else if (e.target.name === "desert") {
      const inputData = [...desert];
      inputData[index] = e.target.value;
      setDesert(inputData);
    }
  };

  const handleAddMenu = (e) => {
    if (e.target.name === "breakfast") {
      setbreakFast([...breakfast, []]);
    } else if (e.target.name === "dinner") {
      setDinner([...dinner, []]);
    } else if (e.target.name === "desert") {
      setDesert([...desert, []]);
    }
  };
  console.log(token);

  const removeInput = (e, index) => {
    if (e.target.name === "breakfast") {
      const newInput = [...breakfast];

      newInput.splice(index, 1);

      setbreakFast(newInput);
    } else if (e.target.name === "dinner") {
      const newInput = [...dinner];

      newInput.splice(index, 1);

      setDinner(newInput);
    } else if (e.target.name === "desert") {
      const newInput = [...desert];

      newInput.splice(index, 1);

      setDesert(newInput);
    }
  };

  const sendMenuData = () => {
    if (
      breakfast.length > 0 &&
      dinner.length > 0 &&
      desert.length > 0 &&
      pricePerPlate
    ) {
      const menu = [[...breakfast], [...dinner], [...desert], pricePerPlate];
      fetch(`/api/menu/${token}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menu }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data === "Unsucessfull") {
            setResponseMessage({ msg: "Invaild Credentials", unSucess: true });
          }
          if (data === "Sucess") {
            // setbreakFast("");
            // setDinner("");
            // setDesert("");
            // setpricePerPlate("");
            setResponseMessage({
              msg: "Sucessfully Create Banquet",
              sucess: true,
            });
            setTimeout(() => {
              window.location.reload(navigate("/"));
            }, 2000);
          }
        });
    } else {
      setResponseMessage({ msg: "Please Fill Form Properly", unSucess: true });
    }
  };

  useEffect(() => {
    const Timer = setTimeout(() => {
      setResponseMessage({ msg: "", unSucess: false, sucess: false });
    }, 2000);

    return () => {
      clearTimeout(Timer);
    };
  }, [responseMessage]);

  return (
    <>
      <div className="boddy">
        <div className="img-section">
          <div className="img-content">
            <h2 className="animate__animated animate__pulse">
              Please Costumize your Available Menu Below
            </h2>
            <p className="animate__animated animate__lightSpeedInLeft">
              Welcome to our menu creation system! With our easy-to-use interface,
              you can create custom menus for any occasion, from intimate dinners
              to large events.
            </p>
          </div>
        </div>
        <div className="banquetMenu-container">
          <h1
            style={{
              fontSize: "50px",
              color: "black",
              fontFamily: "Pacifico",
            }}
          >
            Add Menu
          </h1>
          <section className="banquet-menu-display-flex">
            <section className="breakfast-section menu-section">
              <label htmlFor="breakfast">Breakfast</label>
              {breakfast.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      id="breakfast"
                      name="breakfast"
                      placeholder="breakfast"
                      onChange={(e) => handleChange(e, index)}
                    />

                    <button
                      className="menu-close-btn"
                      name="breakfast"
                      onClick={(e) => {
                        removeInput(e, index);
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
              <button
                className="addMenu-btn"
                name="breakfast"
                onClick={(e) => {
                  handleAddMenu(e);
                }}
              >
                Add Breakfast
              </button>
            </section>

            <section className="dinner-section  menu-section">
              <label htmlFor="breakfast">Dinner</label>
              {dinner.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      id="dinner"
                      name="dinner"
                      placeholder="dinner"
                      onChange={(e) => handleChange(e, index)}
                    />

                    <button
                      className="menu-close-btn"
                      name="dinner"
                      onClick={(e) => {
                        removeInput(e, index);
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
              <button
                className="addMenu-btn"
                name="dinner"
                onClick={(e) => {
                  handleAddMenu(e);
                }}
              >
                Add Dinner
              </button>
            </section>

            <section className="desert-section  menu-section">
              <label htmlFor="desert">Desert</label>
              {desert.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      id="desert"
                      name="desert"
                      placeholder="desert"
                      onChange={(e) => handleChange(e, index)}
                    />

                    <button
                      name="desert"
                      className="menu-close-btn"
                      onClick={(e) => {
                        removeInput(e, index);
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
              <button
                className="addMenu-btn"
                name="desert"
                onClick={(e) => {
                  handleAddMenu(e);
                }}
              >
                Add Desert
              </button>
            </section>
          </section>
          <div style={{ position: "relative" }}>
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

          <section className="price-section  menu-section">
            <label htmlFor="price">Capacity</label>

            <input
              type="number"
              id="price"
              name="price"
              placeholder="Maximum No. of Capacity"
              onChange={(e) => setpricePerPlate(e.target.value)}
            />
          </section>

          <section className="submit-menu-section">
            <button
              className="submit-menu"
              type="submit"
              onClick={() => {
                sendMenuData();
              }}
            >
              Submit Menu
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default Menu;

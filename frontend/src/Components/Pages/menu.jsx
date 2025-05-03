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
  const [capacityError, setCapacityError] = useState("");
  
  // Add validation state for each field type
  const [validationErrors, setValidationErrors] = useState({
    breakfast: [],
    dinner: [],
    desert: []
  });

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    sucess: false,
    unSucess: false,
  });

  const navigate = useNavigate();

  // Function to validate input - no numbers or spaces
  const validateInput = (value) => {
    // Check for numbers
    const hasNumbers = /\d/.test(value);
    // Check for spaces
    const hasSpaces = /\s/.test(value);
    
    if (hasNumbers && hasSpaces) {
      return "Numbers and spaces are not allowed";
    } else if (hasNumbers) {
      return "Numbers are not allowed";
    } else if (hasSpaces) {
      return "Spaces are not allowed";
    }
    
    return ""; // No error
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(value);
    
    if (name === "breakfast") {
      const inputData = [...breakfast];
      inputData[index] = value;
      setbreakFast(inputData);
      
      // Update validation errors
      const newErrors = [...validationErrors.breakfast];
      newErrors[index] = errorMessage;
      setValidationErrors({...validationErrors, breakfast: newErrors});
      
    } else if (name === "dinner") {
      const inputData = [...dinner];
      inputData[index] = value;
      setDinner(inputData);
      
      // Update validation errors
      const newErrors = [...validationErrors.dinner];
      newErrors[index] = errorMessage;
      setValidationErrors({...validationErrors, dinner: newErrors});
      
    } else if (name === "desert") {
      const inputData = [...desert];
      inputData[index] = value;
      setDesert(inputData);
      
      // Update validation errors
      const newErrors = [...validationErrors.desert];
      newErrors[index] = errorMessage;
      setValidationErrors({...validationErrors, desert: newErrors});
    }
  };

  const handleAddMenu = (e) => {
    if (e.target.name === "breakfast") {
      setbreakFast([...breakfast, ""]);
      setValidationErrors({
        ...validationErrors,
        breakfast: [...validationErrors.breakfast, ""]
      });
    } else if (e.target.name === "dinner") {
      setDinner([...dinner, ""]);
      setValidationErrors({
        ...validationErrors,
        dinner: [...validationErrors.dinner, ""]
      });
    } else if (e.target.name === "desert") {
      setDesert([...desert, ""]);
      setValidationErrors({
        ...validationErrors,
        desert: [...validationErrors.desert, ""]
      });
    }
  };

  const removeInput = (e, index) => {
    if (e.target.name === "breakfast") {
      const newInput = [...breakfast];
      newInput.splice(index, 1);
      setbreakFast(newInput);
      
      // Also remove the corresponding validation error
      const newErrors = [...validationErrors.breakfast];
      newErrors.splice(index, 1);
      setValidationErrors({...validationErrors, breakfast: newErrors});
      
    } else if (e.target.name === "dinner") {
      const newInput = [...dinner];
      newInput.splice(index, 1);
      setDinner(newInput);
      
      // Also remove the corresponding validation error
      const newErrors = [...validationErrors.dinner];
      newErrors.splice(index, 1);
      setValidationErrors({...validationErrors, dinner: newErrors});
      
    } else if (e.target.name === "desert") {
      const newInput = [...desert];
      newInput.splice(index, 1);
      setDesert(newInput);
      
      // Also remove the corresponding validation error
      const newErrors = [...validationErrors.desert];
      newErrors.splice(index, 1);
      setValidationErrors({...validationErrors, desert: newErrors});
    }
  };

  // Function to check if there are any validation errors
  const hasValidationErrors = () => {
    return (
      validationErrors.breakfast.some(error => error !== "") ||
      validationErrors.dinner.some(error => error !== "") ||
      validationErrors.desert.some(error => error !== "")
    );
  };

  // Function to check if all required fields are filled and valid
  const isFormValid = () => {
    // Check if there are any validation errors
    if (hasValidationErrors() || capacityError) return false;
    
    // Check if there are any empty inputs
    const hasEmptyBreakfast = breakfast.some(item => !item);
    const hasEmptyDinner = dinner.some(item => !item);
    const hasEmptyDesert = desert.some(item => !item);
    
    // Check if all arrays have at least one item and price is set
    return (
      breakfast.length > 0 && !hasEmptyBreakfast &&
      dinner.length > 0 && !hasEmptyDinner &&
      desert.length > 0 && !hasEmptyDesert &&
      pricePerPlate && Number(pricePerPlate) > 0
    );
  };

  const sendMenuData = () => {
    if (isFormValid()) {
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
            setResponseMessage({ msg: "Invalid Credentials", unSucess: true });
          }
          if (data === "Sucess") {
            setResponseMessage({
              msg: "Successfully Created Banquet",
              sucess: true,
            });
            setTimeout(() => {
              window.location.reload(navigate("/"));
            }, 2000);
          }
        });
    } else {
      if (hasValidationErrors()) {
        setResponseMessage({ msg: "Please fix validation errors", unSucess: true });
      } else if (capacityError) {
        setResponseMessage({ msg: "Capacity must be greater than zero", unSucess: true });
      } else {
        setResponseMessage({ msg: "Please Fill Form Properly", unSucess: true });
      }
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
              Please Customize your Available Menu Below
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
                      id={`breakfast-${index}`}
                      name="breakfast"
                      placeholder="breakfast"
                      value={item}
                      onChange={(e) => handleChange(e, index)}
                      className={validationErrors.breakfast[index] ? "input-error" : ""}
                    />
                    {validationErrors.breakfast[index] && (
                      <div className="error-message">{validationErrors.breakfast[index]}</div>
                    )}
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

            <section className="dinner-section menu-section">
              <label htmlFor="dinner">Dinner</label>
              {dinner.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      id={`dinner-${index}`}
                      name="dinner"
                      placeholder="dinner"
                      value={item}
                      onChange={(e) => handleChange(e, index)}
                      className={validationErrors.dinner[index] ? "input-error" : ""}
                    />
                    {validationErrors.dinner[index] && (
                      <div className="error-message">{validationErrors.dinner[index]}</div>
                    )}
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

            <section className="desert-section menu-section">
              <label htmlFor="desert">Desert</label>
              {desert.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      id={`desert-${index}`}
                      name="desert"
                      placeholder="desert"
                      value={item}
                      onChange={(e) => handleChange(e, index)}
                      className={validationErrors.desert[index] ? "input-error" : ""}
                    />
                    {validationErrors.desert[index] && (
                      <div className="error-message">{validationErrors.desert[index]}</div>
                    )}
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
                  <h2>{responseMessage.msg}</h2>
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

          <section className="price-section menu-section">
            <label htmlFor="price">Capacity</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Maximum No. of Capacity"
              min="1"
              onChange={(e) => {
                const value = Number(e.target.value);
                setpricePerPlate(value);
                if (value <= 0) {
                  setCapacityError("Capacity must be greater than zero");
                } else {
                  setCapacityError("");
                }
              }}
              className={capacityError ? "input-error" : ""}
            />
            {capacityError && (
              <div className="error-message">{capacityError}</div>
            )}
          </section>

          <section className="submit-menu-section">
            <button
              className="submit-menu"
              type="submit"
              onClick={() => {
                sendMenuData();
              }}
              disabled={!isFormValid()}
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
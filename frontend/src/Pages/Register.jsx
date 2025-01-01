import React, { useState, useEffect } from "react";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    success: false,
    unsuccess: false,
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/register", user);
    console.log(response);
    if (response.data === "Unsuccessful") {
      setResponseMessage({ msg: "Cannot Register", unsuccess: true });
    } else if (response.data === "Successful") {
      setResponseMessage({
        msg: "Successful, Please Check your Email For Verification",
        success: true,
      });
    }
  };

  useEffect(() => {
    const Timer = setTimeout(() => {
      setResponseMessage({ msg: "", unsuccess: false, success: false });
    }, 2000);

    return () => {
      clearTimeout(Timer);
    };
  }, [responseMessage]);

  return (
    <>
      <main>
        <div className="auth-container">
          <section className="auth-first-section">
            <section className="card-design">
              <section className="u-shaped card-01"></section>
              <section className="u-shaped card-02"></section>
              <section className="u-shaped card-03"></section>
              <section className="u-shaped card-04"></section>
            </section>
            <section className="register-form">
              <h1 id="register-text">Register Account</h1>
              <form className="register" onSubmit={handleSubmit}>
                <div className="name-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Username"
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="email-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    placeholder="Email"
                    onChange={handleChange}
                  />
                </div>

                <div className="number-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    placeholder="Number"
                    value={user.number}
                    onChange={handleChange}
                    pattern="[0-9]{10,}"
                    title="Phone number must contain at least 10 digits."
                    required
                  />
                </div>

                <div className="password-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                    title="Password must contain at least one uppercase letter, one number, and a special character."
                  />
                </div>

                <div className="btn-pass">
                  <button type="submit" className="btn">
                    Register Account
                  </button>
                </div>

                {/* Links for Sign-in and Banquet Owner */}
                <div className="forget-pass">
                  <a href="login">Already have an account? Sign in.</a>
                </div>
                <div className="banquet-owner-option">
                  <p>
                    Are you a banquet owner?{" "}
                    <a href="Banquetregistration">List your service here</a>.
                  </p>
                </div>
              </form>
            </section>
            {responseMessage.success && (
              <article className="pop-up">
                <AiFillCheckCircle size={100} color="lime" />
                <h2>{responseMessage.msg}.</h2>
              </article>
            )}
            {responseMessage.unsuccess && (
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
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Register;
